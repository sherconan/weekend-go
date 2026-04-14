// 小红书真实笔记（Top 3 按点赞数排序）
// 数据抓取自 xiaohongshu-skills/xhs-explore，保存时间：2026-04-15
// 字段：title 标题 / author 作者 / likes 点赞数 / cover 本地封面 / url 跳转链接

const XHS_VOICES = {
  "北京环球影城": [
    {
      title: "有了这条视频，其他的环球影城攻略就丢了吧",
      author: "途家民宿北京旅游攻略",
      likes: 74064,
      cover: "assets/xhs/universal-studios-1.webp",
      url: "https://www.xiaohongshu.com/explore/6823006b0000000023017827?xsec_token=ABYJk7OjF_4lr1HeELS2LKEBzj600HKS6Oe9dbujCjtPQ=&xsec_source=pc_feed"
    },
    {
      title: "去了4次环球影城，我做了个攻略|不累版",
      author: "独居日记",
      likes: 17520,
      cover: "assets/xhs/universal-studios-2.webp",
      url: "https://www.xiaohongshu.com/explore/687d086c000000002203c13a?xsec_token=AByEtG4XQfqXLlgG5hRwHwltGhj8HMme-kbBlCl9K72TU=&xsec_source=pc_feed"
    },
    {
      title: "北京环球影城刚去完，③条近路直接抄作业！",
      author: "Jessie去哪里呀",
      likes: 8713,
      cover: "assets/xhs/universal-studios-3.webp",
      url: "https://www.xiaohongshu.com/explore/69466fd4000000001e02b2aa?xsec_token=AByaIfKMOi8yp1CqBKwYdcxqJIKSiZkwEn-hxgk8tkojQ=&xsec_source=pc_feed"
    }
  ],
  "古北水镇": [
    {
      title: "北京古北水镇1日游暴走全攻略｜附节目时间",
      author: "山竹的旅行",
      likes: 804,
      cover: "assets/xhs/gubei-1.webp",
      url: "https://www.xiaohongshu.com/explore/68b588f9000000001d00559e?xsec_token=ABw6MazWqDA1-FC5O-WmVer4UXIrLImPQaYXRgnx6T1Sw=&xsec_source=pc_feed"
    },
    {
      title: "211女研北京古北水镇攻略[精炼现有攻略版]",
      author: "今天也是爱美的小洋呀",
      likes: 770,
      cover: "assets/xhs/gubei-2.webp",
      url: "https://www.xiaohongshu.com/explore/69493cdd000000001e035a4f?xsec_token=ABnvcFu_ncMj7lgCBzA9P7Jz7IL1z8JJLjbQFjReM99DI=&xsec_source=pc_feed"
    },
    {
      title: "古北水镇旅游注意事项⚠️贴",
      author: "sunfluna",
      likes: 559,
      cover: "assets/xhs/gubei-3.webp",
      url: "https://www.xiaohongshu.com/explore/683f980c000000002300f2be?xsec_token=ABHieDSSQkOhCdVz915SirqdgXwEHvgJDSQXBlf_POHKE=&xsec_source=pc_feed"
    }
  ],
  "慕田峪长城": [
    {
      title: "慕田峪长城，没人！",
      author: "Miguel 米格尔",
      likes: 1380,
      cover: "assets/xhs/mutianyu-1.webp",
      url: "https://www.xiaohongshu.com/explore/68a1fc11000000001c030b7c?xsec_token=ABzpWWtxYsbxZvGMyEGJku-vROIBMcQQpyNN2iEeou-Rk=&xsec_source=pc_feed"
    },
    {
      title: "慕田峪长城不坐索道速通的好处不止省钱",
      author: "Jay麻麻",
      likes: 797,
      cover: "assets/xhs/mutianyu-2.webp",
      url: "https://www.xiaohongshu.com/explore/6867e296000000000b02c6ba?xsec_token=ABoOLxqhHxMJtgybqwrqoTd43eyCh0Yzpc_VFwMRSig_4=&xsec_source=pc_feed"
    },
    {
      title: "一篇讲清楚怎么逛好慕田峪",
      author: "云朵儿",
      likes: 672,
      cover: "assets/xhs/mutianyu-3.webp",
      url: "https://www.xiaohongshu.com/explore/687a7aff0000000010026a55?xsec_token=ABgdtJO3hnnGD7N2lgdnIoLaqgP4z1VByCALZM9F2QUrc=&xsec_source=pc_feed"
    }
  ]
};

function getXhsVoices(name) {
  return XHS_VOICES[name] || [];
}
