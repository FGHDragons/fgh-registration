var banners = {
  main: "https://i.postimg.cc/0NSgNH5b/success-banner.jpg",
  new_member: "https://i.postimg.cc/GpDPt6BB/new-member-package-banner-M.webp",
  ttac: "https://i.postimg.cc/nzt4DT7q/deposit-bonus-banner-M.webp",
  payday: "https://i.postimg.cc/9f9P0sDv/payday-bonus-banner-M.webp",
  welcome_back: "https://i.postimg.cc/9QKtWcfH/Welcome-back.jpg",
  norollover: "https://i.postimg.cc/BQJmyZjD/No-Rollover.webp"
};

function sendNewSubscriberGate(chatId) {
  var ikb = { inline_keyboard: [
    [{text:"🎁 Claim Bonus", callback_data:"gate_lock"}, {text:"💬 Talk to Support", callback_data:"gate_lock"}],
    [{text:"📱 View Channel", url: "https://t.me/fungaminghubph"}]
  ]};
  var cap = "🎰✨ WELCOME TO FGH Telegram ChatBot! ✨🎰\n\n🎁 Your reward locker is waiting...\nExclusive promos, bonuses & surprises are ready for you 👀\n\nThink you can unlock them all? 🔑\n👉 Join the official channel and start winning today!";
  sendPhoto(chatId, banners.main, cap, ikb);
}

function handlePromoNavigation(chatId, msgId, action, userId) {
  var cap = ""; var img = ""; var ikb = [];

  if (action === "promo_main") {
    sendPromotionsMenu(chatId, true, msgId);
    return;
  }

  switch(action) {
    case "p_new":
      img = banners.new_member;
      cap = "🧧 **NEW MEMBER PACKAGE**\nClaim up to ₱1,250 in Bonuses!\n\n" +
            "1st Dep: 200 (20%)\n2nd Dep: 300 (25%)\n3rd Dep: 400 (30%)\n4th Dep: 500 (35%)\n5th Dep: 1000 (40%)\n\n" +
            "✔️ Slots Only\n✔️ 5x Rollover\n🔗 [REGISTER NOW](https://fgh.fun/promotion/new-member-bonus)";
      break;
    case "p_3rd":
      img = banners.ttac;
      cap = "🍀 **THIRD TIME'S A CHARM**\n20% Bonus on your 3rd deposit!\n\n" +
            "Min Dep 1: 500+ | Min Dep 2: 500+\nDep 3: 1000+ (Get 200 Bonus)\n\n" +
            "✔️ Slots Only\n✔️ 5x Rollover\n🔗 [DEPOSIT NOW](https://fgh.fun/promotion/third-time-charm-deposit-bonus)";
      break;
    case "p_pay":
      img = banners.payday;
      cap = "📆 **PAYDAY BONUS (15th-18th)**\nGet up to ₱1,800 Bonus!\n\n" +
            "Dep 500 -> 50 Bonus\nDep 3000 -> 600 Bonus\n\n" +
            "✔️ 3x Rollover\n🔗 [CLAIM PAYDAY](https://fgh.fun/promotion/payday-bonus)";
      break;
  }
  
  ikb = { inline_keyboard: [[{text: "⬅️ Back to Menu", callback_data: "promo_main"}]] };
  editPhoto(chatId, msgId, img, cap, ikb);
}

function sendVipPerks(chatId) {
  var table = "💎 **FGH VIP REWARDS HUB**\n\nLevel | Daily | Weekly | Birthday\n" +
              "**Emerald** | - | 3% | ₱250\n" +
              "**Sapphire** | 5k | 4% | ₱500\n" +
              "**Ruby** | 20k | 5% | ₱750\n" +
              "**Diamond** | 100k | 6% | ₱1,000\n" +
              "**Alexandrite** | 500k | 7% | ₱2,000\n\n" +
              "🔗 [CHECK VIP HUB](https://fgh.fun/vip)";
  sendBotMessage(tokenBot2, chatId, table);
}

function sendSupportMenu(chatId) {
  var cap = "👩‍💻 **FGH OFFICIAL SUPPORT**\nPlease save our number to your contacts before messaging.\n\n" +
            "1. Scan QR for Viber\n2. Scan QR for Telegram\n\nSelect a channel below:";
  var ikb = { inline_keyboard: [[{text: "Viber Support", url: "https://i.postimg.cc/tgv1XJT9/2.png"}, {text: "Telegram Support", url: "https://i.postimg.cc/HxJrjmc7/3.png"}]] };
  sendPhoto(chatId, "https://i.postimg.cc/tgv1XJT9/2.png", cap, ikb);
}