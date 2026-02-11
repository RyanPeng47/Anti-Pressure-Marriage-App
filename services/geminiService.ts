import { GoogleGenAI, Type } from "@google/genai";
import { QuoteCardData, MarriageCostData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

export const generateWittyComeback = async (quote: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a legendary "Roast Master" (吐槽役) and Stand-up Comedian in China, specialized in shutting down annoying relatives.
      
      User says: "${quote}"
      
      Task: Provide a single, extremely witty, slightly absurd, and hilarious comeback (神回复).
      
      Style Guidelines:
      1. Use Internet Slang (玩梗) and Gen-Z humor.
      2. Be "Mad" (发疯文学) or "Logical Fallacy" (用魔法打败魔法).
      3. Short, punchy, and memorable.
      4. Avoid polite or preachy lectures. Make it a joke.
      
      Example tone: 
      - "Why aren't you married?" -> "Waiting for the country to distribute a partner. I pay taxes, I expect government services."
      - "I want a grandson." -> "Go to the supermarket entrance, 1 RMB for 5 minutes on the rocking car."
      
      Output strictly the text of the comeback only.`,
      config: {
        temperature: 1.1, // Higher temperature for more creativity/craziness
      }
    });
    return response.text || "系统正在大脑过载，正在寻找最毒的词汇...";
  } catch (error) {
    console.error("Error generating comeback:", error);
    return "哎呀，怼人系统过热了，让它歇歇。";
  }
};

export const calculateCityCosts = async (city: string): Promise<MarriageCostData> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Estimate the realistic cost of getting married in ${city}, China in 2024.
      Return a JSON object. Values should be in CNY (RMB).
      Be realistic but slightly pessimistic (high estimates) to emphasize the burden.
      
      Fields required:
      - housingDownPayment: Down payment for a standard 3-bedroom apartment (30% of total).
      - weddingCeremony: Hotel, banquet, decoration.
      - dowry: Caili (彩礼).
      - jewelry: Rings, gold ("Three Gold" etc).
      - honeymoon: Trip cost.
      - other: Photos, clothes, miscellaneous.
      - timeCostHours: Total hours spent planning and executing.
      - sunkCost: Estimated dating costs over 2 years prior to marriage.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            housingDownPayment: { type: Type.NUMBER },
            weddingCeremony: { type: Type.NUMBER },
            dowry: { type: Type.NUMBER },
            jewelry: { type: Type.NUMBER },
            honeymoon: { type: Type.NUMBER },
            other: { type: Type.NUMBER },
            timeCostHours: { type: Type.NUMBER },
            sunkCost: { type: Type.NUMBER },
          },
          required: ["housingDownPayment", "weddingCeremony", "dowry", "jewelry", "honeymoon", "timeCostHours", "sunkCost"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const totalCost = (data.housingDownPayment || 0) + (data.weddingCeremony || 0) + (data.dowry || 0) + (data.jewelry || 0) + (data.honeymoon || 0) + (data.other || 0);

    return {
      city,
      totalCost,
      housingDownPayment: data.housingDownPayment || 0,
      weddingCeremony: data.weddingCeremony || 0,
      dowry: data.dowry || 0,
      jewelry: data.jewelry || 0,
      honeymoon: data.honeymoon || 0,
      other: data.other || 0,
      timeCostHours: data.timeCostHours || 0,
      sunkCost: data.sunkCost || 0,
    };
  } catch (error) {
    console.error("Error calculating costs:", error);
    // Fallback data
    return {
      city,
      totalCost: 1000000,
      housingDownPayment: 600000,
      weddingCeremony: 100000,
      dowry: 188888,
      jewelry: 50000,
      honeymoon: 30000,
      other: 31112,
      timeCostHours: 400,
      sunkCost: 50000
    };
  }
};

export const defaultQuotes: QuoteCardData[] = [
  {
    id: '1',
    quote: "什么时候结婚啊？再不结就没人要了！",
    comeback: "没人要？我是限量版手办，只供瞻仰，不供把玩。再说了，超市里没人抢的才是烂叶子。",
    category: 'direct'
  },
  {
    id: '2',
    quote: "你看看隔壁小王，孩子都打酱油了。",
    comeback: "那说明他不仅繁殖能力强，还避孕意识差。人类进化出大脑是为了思考，不是像草履虫一样着急分裂。",
    category: 'funny'
  },
  {
    id: '3',
    quote: "眼光不要太高，差不多就行了。",
    comeback: "差不多就行？那您当初买股票怎么不随便买个‘差不多’的？这可是我的人生，不是拼多多九块九包邮。",
    category: 'funny'
  },
  {
    id: '4',
    quote: "不结婚老了谁照顾你？",
    comeback: "我有钱住高级养老院，那是‘氪金玩家’。养儿防老？那是‘赌博’，万一抽出个R级的不孝子，连氧气管都给我拔了。",
    category: 'philosophical'
  },
  {
    id: '5',
    quote: "我是为你好！",
    comeback: "为我好就给我转账。嘘寒问暖不如打笔巨款，手头紧不如嘴巴紧。",
    category: 'direct'
  },
  {
    id: '6',
    quote: "趁年轻赶紧生，恢复得快。",
    comeback: "恢复得快？您这口气像是在劝我趁热吃屎。子宫是我的器官，不是国家的生产线。",
    category: 'direct'
  },
  {
    id: '7',
    quote: "大家都结婚，怎么就你特殊？",
    comeback: "大家都终归一死，我也没见您着急去排队啊？做人要像人民币，独特才招人稀罕。",
    category: 'philosophical'
  },
  {
    id: '8',
    quote: "我也想抱孙子啊。",
    comeback: "想抱孙子？去超市门口坐那个摇摇车，一块钱能抱五分钟，还带音乐‘爸爸的爸爸叫爷爷’。",
    category: 'funny'
  },
  {
    id: '9',
    quote: "一个人多孤单啊。",
    comeback: "孤单？手机不好玩吗？游戏不香吗？我有那时间伺候巨婴，不如在峡谷里拿个五杀。我的快乐您想象不到。",
    category: 'funny'
  },
  {
    id: '10',
    quote: "再不嫁就成老姑娘了。",
    comeback: "老姑娘怎么了？茅台也是越老越值钱。您见过谁喝82年的雪碧吗？",
    category: 'funny'
  },
  {
    id: '11',
    quote: "别整天想那些虚的，过日子就是柴米油盐。",
    comeback: "所以我才不结婚啊。我自己赚钱买柴米油盐挺香的，为什么要找个人来对我的菜指手画脚，还嫌我盐放多了？",
    category: 'passive-aggressive'
  },
  {
    id: '12',
    quote: "你就是太自私了，不考虑父母感受。",
    comeback: "您为了面子逼我不幸福，咱俩到底谁自私？道德绑架这招对我没用，我有道德豁免权，还是永久VIP。",
    category: 'direct'
  },
  {
    id: '13',
    quote: "男大当婚，女大当嫁，这是自然规律。",
    comeback: "物竞天择也是规律，我不结婚是优化人类基因库，免得生出不幸福的下一代，我这是在做慈善。",
    category: 'philosophical'
  },
  {
    id: '14',
    quote: "你这么强势，哪个男人敢要？",
    comeback: "我是找战友，不是找宠物。弱的我也看不上，强的自然懂欣赏。您就别替皇上操心了，太监才操这心。",
    category: 'direct'
  },
  {
    id: '15',
    quote: "我就觉得这小伙子面相好。",
    comeback: "面相好能当饭吃？面相好能还房贷？您要是喜欢，您认个干儿子，以后让他给您养老，我绝不拦着。",
    category: 'funny'
  },
  {
    id: '16',
    quote: "供你读书就是为了让你嫁个好人家。",
    comeback: "那您亏大发了！供我读书是为了让我知道，我不嫁人也能过得很好，不需要依附任何人。",
    category: 'direct'
  },
  {
    id: '17',
    quote: "你要在这个城市扎根就得结婚。",
    comeback: "扎根靠的是房产证，不是结婚证。我自己买房，我自己就是根，不用依附在别人的烂泥地里。",
    category: 'direct'
  },
  {
    id: '18',
    quote: "你是不是有什么心理问题？",
    comeback: "我有啊，最大的心理阴影就是每次回家都被催婚。您要是为了我心理健康，现在闭嘴就是最好的治疗。",
    category: 'passive-aggressive'
  },
  {
    id: '19',
    quote: "等你老了生病了怎么办？",
    comeback: "只要我有钱，护工比孝子更贴心。护工是为了钱，肯定好好伺候；孝子是为了遗产，巴不得我早点走。",
    category: 'philosophical'
  },
  {
    id: '20',
    quote: "不要太挑剔，过日子都要磨合。",
    comeback: "磨合？鞋子不合脚会磨出泡，磨到最后脚都废了。我宁愿光脚跑，也不穿带刺的鞋。",
    category: 'passive-aggressive'
  },
  {
    id: '21',
    quote: "我看那谁谁谁就挺幸福的。",
    comeback: "朋友圈里的幸福您也信？微商还说自己月入百万喜提和谐号呢。未经他人苦，莫劝他人善。",
    category: 'direct'
  },
  {
    id: '22',
    quote: "早点生孩子，父母能帮你带。",
    comeback: "帮我带？那孩子跟您姓吗？再说了，我还没玩够呢，不想生个玩具给您玩，玩坏了还是我修。",
    category: 'funny'
  },
  {
    id: '23',
    quote: "不结婚，人生不完整。",
    comeback: "结了婚，人生是完整了，因为‘完了’。我宁愿残缺地快乐，也不要完整地受罪。",
    category: 'funny'
  },
  {
    id: '24',
    quote: "彩礼/嫁妆我们出，不用你操心。",
    comeback: "钱能解决的问题都不是问题，问题是钱解决不了‘人不行’。您能花钱买个听话的机器人吗？",
    category: 'direct'
  },
  {
    id: '25',
    quote: "这是我们当父母的最后一点心愿。",
    comeback: "心愿这东西，得自己努力实现。您的心愿为什么要牺牲我的幸福？建议您换个心愿，比如跳广场舞站C位。",
    category: 'direct'
  }
];