const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const axios = require('axios');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

app.use(cors());
app.use(express.json({ limit: '50mb' })); // 增加JSON请求体大小限制
app.use(express.urlencoded({ limit: '50mb', extended: true })); // 增加URL编码请求体大小限制
app.use(express.static('.'));

// 审计规则定义
const auditRules = {
  rule1: (row) => {
    // 规则1: 上午9点前到公司打车
    const startTime = new Date(row['开始计费时间']);
    const destination = row['实际目的地'] || '';
    if (startTime.getHours() < 9 && destination.includes('物产天地中心')) {
      return '用车理由不合规，疑似上班打车';
    }
    return null;
  },
  
  rule2: (row) => {
    // 规则2: KTV、足浴店等会所
    const keywords = ['KTV', 'ktv', '足浴', '会所', '洗浴', '桑拿', '按摩'];
    const departure = row['实际出发地'] || '';
    const destination = row['实际目的地'] || '';
    for (let keyword of keywords) {
      if (departure.includes(keyword) || destination.includes(keyword)) {
        return '用车地址不得出现KTV、足浴店等会所';
      }
    }
    return null;
  },
  
  rule3: (row) => {
    // 规则3: "加班"用词
    const note = row['补充说明'] || '';
    if (note.includes('加班')) {
      return '用车理由不得出现"加班"，可写21点以后离开公司';
    }
    return null;
  },
  
  rule4: (row) => {
    // 规则4: "接""送"客户
    const note = row['补充说明'] || '';
    if ((note.includes('接') || note.includes('送'))) {
      return '用车理由不得出现"接""送"客户';
    }
    return null;
  },
  
  rule5: (row) => {
    // 规则5: "招待""接待"客户
    const note = row['补充说明'] || '';
    if ((note.includes('招待') || note.includes('接待')) && note.includes('客户')) {
      return '用车理由不得出现"招待""接待"xx客户';
    }
    return null;
  },
  
  rule6: (row) => {
    // 规则6: 替他人打车
    const note = row['补充说明'] || '';
    const keywords = ['替', '代', '帮'];
    for (let keyword of keywords) {
      if (note.includes(keyword) && (note.includes('打车') || note.includes('用车'))) {
        return '用车只能本人用车，不允许替他人打车';
      }
    }
    return null;
  },
  
  rule7: (row) => {
    // 规则7: 高额费用或豪华车型
    const amount = parseFloat(row['企业实付金额']);
    const carType = row['用车类型(明细)'] || '';
    if (amount > 200) {
      return '单次用车费用远超同城平均水平';
    }
    if (carType.includes('豪华') || carType.includes('商务')) {
      return '单次用车费用远超同城平均水平';
    }
    return null;
  },

  rule8: (row) => {
    // 规则8: 用车类型与补充说明匹配度
    const carType = row['用车类型(明细)'] || '';
    const note = row['补充说明'] || '';

    // 检查是否使用了高价车型
    const isHighEndCar = carType.includes('豪华') || carType.includes('商务');

    if (isHighEndCar) {
      // 检查补充说明是否有必要性说明
      const necessaryKeywords = ['接待', '招待', '重要客户', '重要会议', '董事', '总经理', '客户'];
      const hasNecessaryReason = necessaryKeywords.some(keyword => note.includes(keyword));

      // 如果使用高价车型但缺乏必要性说明
      if (!hasNecessaryReason) {
        return '用车类型选用了高价类型,缺乏必要性说明';
      }
    }
    return null;
  }
};

// 执行审计
const auditRow = (row) => {
  const results = [];
  for (let ruleKey in auditRules) {
    const result = auditRules[ruleKey](row);
    if (result) {
      results.push(result);
    }
  }
  return results.length > 0 ? results.join('; ') : '';
};

// 调用AI进行审计（可选的AI增强）
const callAIAudit = async (rowData) => {
  try {
    const prompt = `
你是一个用车审计专家。请根据以下规则对这条用车记录进行审计：

规则1: 如果开始计费时间为上午9点以前打车，且目的地为公司(包含了'物产天地中心')，则审计结果='用车理由不合规，疑似上班打车'
规则2: 如果实际出发地,实际目的地出现任何“KTV”、“会所”、“酒吧”、“夜店”、“足浴”、“按摩”、“SPA”、“高尔夫”等非业务相关娱乐消费场所的关键词,则审计结果='用车地址不得出现KTV、足浴店等会所'
规则3: 补充说明出现"加班"，则审计结果='用车理由不得出现"加班"，可写21点以后离开公司'
规则4: 补充说明出现"接","送"客户等，审计结果='用车理由不得出现"接""送"客户'
规则5: 补充说明出现"招待""接待"xx客户，审计结果='用车理由不得出现"招待""接待"xx客户'
规则6: 补充说明如果替他人打车，审计结果='用车只能本人用车，不允许替他人打车'
规则7: 单次用车费用远超同城平均水平（例如：单次超过200元），或用车类型(明细)为"豪华型"、"商务型"等非必要的高价车型，审计结果='单次用车费用远超同城平均水平'
规则8: 如果使用了"豪华型"、"商务型"等高价用车类型，但补充说明仅为"常规外出"或"加班"，缺乏"接待重要客户"等必要性说明，则审计结果='用车类型选用了高价类型,缺乏必要性说明'

用车记录：
${JSON.stringify(rowData, null, 2)}

请只返回审计结果，如果合规则返回空字符串。`;

    const response = await axios.post(
      `${process.env.AI_GATEWAY_URL}?key=${process.env.AI_GATEWAY_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'OE-Key': process.env.OE_KEY,
          'OE-Gateway-Name': process.env.OE_GATEWAY_NAME,
          'OE-AI-Provider': process.env.OE_AI_PROVIDER,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.candidates && response.data.candidates[0]) {
      const aiResult = response.data.candidates[0].content.parts[0].text.trim();
      // 添加AI标识
      return aiResult ? `[AI] ${aiResult}` : '';
    }
  } catch (error) {
    console.error('AI审计错误:', error.message);
  }
  return null;
};

// 上传并审计Excel
app.post('/api/audit', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    // 读取Excel文件
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets['用车订单'];

    if (!worksheet) {
      return res.status(400).json({ error: '未找到"用车订单"sheet' });
    }

    // 转换为JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // 执行审计 - 包括合规数据也要传给AI判别
    const auditedData = await Promise.all(data.map(async (row) => {
      // 先执行本地规则检查
      const localResult = auditRow(row);

      // 如果本地规则检查有结果，使用本地结果
      if (localResult) {
        return {
          ...row,
          '审计结果': localResult
        };
      }

      // 如果本地规则检查合规，再传给AI进行判别
      const aiResult = await callAIAudit(row);
      return {
        ...row,
        '审计结果': aiResult || ''
      };
    }));

    // 统计结果
    const compliant = auditedData.filter(r => !r['审计结果']).length;
    const nonCompliant = auditedData.filter(r => r['审计结果']).length;

    res.json({
      success: true,
      data: auditedData,
      stats: {
        total: auditedData.length,
        compliant,
        nonCompliant
      }
    });
  } catch (error) {
    console.error('审计错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 生成审计风险报告
app.post('/api/risk-report', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || data.length === 0) {
      return res.status(400).json({ error: '没有数据' });
    }

    // 分析数据生成风险报告
    const nonCompliantData = data.filter(r => r['审计结果']);

    // 1. 风险摘要
    const totalRisk = nonCompliantData.length;
    const riskRate = ((totalRisk / data.length) * 100).toFixed(2);
    let overallRisk = '低';
    if (riskRate > 30) overallRisk = '高';
    else if (riskRate > 15) overallRisk = '中';

    // 2. 按规则分类统计
    const ruleStats = {};
    nonCompliantData.forEach(row => {
      const result = row['审计结果'] || '';
      const rules = result.split(';').map(r => r.trim()).filter(r => r);
      rules.forEach(rule => {
        ruleStats[rule] = (ruleStats[rule] || 0) + 1;
      });
    });

    // 3. 高风险员工/部门统计
    const employeeRisk = {};
    const departmentRisk = {};

    nonCompliantData.forEach(row => {
      const name = row['下单人姓名'] || '未知';
      const dept = row['部门名称'] || '未知';
      const amount = parseFloat(row['企业实付金额']) || 0;

      if (!employeeRisk[name]) {
        employeeRisk[name] = { count: 0, amount: 0, violations: [] };
      }
      employeeRisk[name].count++;
      employeeRisk[name].amount += amount;
      employeeRisk[name].violations.push(row['审计结果']);

      if (!departmentRisk[dept]) {
        departmentRisk[dept] = { count: 0, amount: 0 };
      }
      departmentRisk[dept].count++;
      departmentRisk[dept].amount += amount;
    });

    // 排序获取高风险员工和部门
    const topEmployees = Object.entries(employeeRisk)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, data]) => ({
        name,
        violations: data.count,
        amount: data.amount.toFixed(2),
        details: data.violations
      }));

    const topDepartments = Object.entries(departmentRisk)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([dept, data]) => ({
        dept,
        violations: data.count,
        amount: data.amount.toFixed(2)
      }));

    // 生成报告
    const report = {
      generatedAt: new Date().toLocaleString('zh-CN'),
      summary: {
        totalRecords: data.length,
        compliantRecords: data.length - nonCompliantData.length,
        nonCompliantRecords: nonCompliantData.length,
        complianceRate: ((((data.length - nonCompliantData.length) / data.length) * 100).toFixed(2)) + '%',
        riskRate: riskRate + '%',
        overallRisk: overallRisk
      },
      ruleAnalysis: Object.entries(ruleStats)
        .sort((a, b) => b[1] - a[1])
        .map(([rule, count]) => ({
          rule,
          violations: count,
          percentage: ((count / nonCompliantData.length) * 100).toFixed(2) + '%'
        })),
      highRiskEmployees: topEmployees,
      highRiskDepartments: topDepartments,
      conclusion: generateConclusion(overallRisk, riskRate, topEmployees, topDepartments)
    };

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('风险报告生成错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 生成结论
const generateConclusion = (overallRisk, riskRate, topEmployees, topDepartments) => {
  let conclusion = `\n总体风险评估：${overallRisk}风险\n`;
  conclusion += `不合规率：${riskRate}%\n\n`;

  if (overallRisk === '高') {
    conclusion += '⚠️ 警告：用车合规性存在严重问题，需要立即采取措施。\n';
  } else if (overallRisk === '中') {
    conclusion += '⚠️ 注意：用车合规性存在一定问题，建议加强管理。\n';
  } else {
    conclusion += '✓ 用车合规性良好，继续保持。\n';
  }

  if (topEmployees.length > 0) {
    conclusion += `\n重点关注员工：${topEmployees.slice(0, 3).map(e => e.name).join('、')}\n`;
  }

  if (topDepartments.length > 0) {
    conclusion += `重点关注部门：${topDepartments.slice(0, 3).map(d => d.dept).join('、')}\n`;
  }

  return conclusion;
};

// 下载审计结果Excel
app.post('/api/download-audit', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || data.length === 0) {
      return res.status(400).json({ error: '没有数据' });
    }

    // 创建新的workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, '用车订单');

    // 设置列宽 - 与原始文件保持一致
    const colWidths = [
      { wch: 12 }, // 账期
      { wch: 12 }, // 部门名称
      { wch: 15 }, // 用车类型
      { wch: 12 }, // 下单人姓名
      { wch: 12 }, // 下单人电话
      { wch: 12 }, // 企业实付金额
      { wch: 18 }, // 下单时间
      { wch: 18 }, // 开始计费时间
      { wch: 18 }, // 结束计费时间
      { wch: 12 }, // 用车城市
      { wch: 12 }, // 到达城市
      { wch: 20 }, // 实际出发地
      { wch: 20 }, // 实际目的地
      { wch: 30 }, // 补充说明
      { wch: 30 }  // 审计结果 - 与补充说明列宽保持一致
    ];
    worksheet['!cols'] = colWidths;

    // 设置单元格格式 - 使审计结果列与补充说明列格式一致
    if (worksheet['!rows']) {
      // 保持行高一致
    }

    // 为所有单元格设置文本格式（与补充说明列一致）
    for (let cell in worksheet) {
      if (cell.startsWith('N') || cell.startsWith('O')) { // N列是补充说明，O列是审计结果
        if (worksheet[cell] && typeof worksheet[cell] === 'object') {
          worksheet[cell].t = 's'; // 设置为文本格式
        }
      }
    }

    // 生成Excel文件
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // 对文件名进行 URL 编码以支持中文
    const filename = encodeURIComponent('用车订单审计结果.xlsx');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (error) {
    console.error('下载错误:', error);
    res.status(500).json({ error: error.message });
  }
});

// 一键AI分析端点
app.post('/api/ai-analysis', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || data.length === 0) {
      return res.status(400).json({ error: '没有数据需要分析' });
    }

    // 对每条数据进行AI分析
    const analysisResults = await Promise.all(data.map(async (row, index) => {
      try {
        const aiResult = await callAIAudit(row);
        return {
          ...row,
          '审计结果': aiResult || ''
        };
      } catch (error) {
        console.error(`第 ${index + 1} 条数据AI分析失败:`, error.message);
        return {
          ...row,
          '审计结果': ''
        };
      }
    }));

    res.json({
      success: true,
      data: analysisResults,
      message: `成功分析 ${analysisResults.length} 条数据`
    });
  } catch (error) {
    console.error('AI分析错误:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

