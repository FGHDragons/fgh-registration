var tokenBot1 = "8866050553:AAFQG8kBs5hyyFuv9d16RSNtXr9v1EBui_Q";
var tokenBot2 = "8693536513:AAEt0jh0QD79tlqqxeZRpDNwB3le5VW-82A";
var groupId = "-1003911200418";

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    
    // 1. CALLBACK QUERIES (Menu Navigation)
    if (contents.callback_query) {
      var cb = contents.callback_query;
      var chatId = cb.message.chat.id;
      var userId = cb.from.id.toString();
      var data = cb.data;

      if (data === "gate_lock") {
        if (!checkUserExists(userId)) return sendWelcomeGate(chatId);
        return sendPromotionsMenu(chatId, true);
      }
      handlePromoNavigation(chatId, cb.message.message_id, data, userId);
      return;
    }

    // 2. MESSAGE HANDLER
    if (contents.message) {
      var msg = contents.message;
      var chatId = msg.chat.id.toString();
      var userId = msg.from.id.toString();
      var text = msg.text || "";

      // BOT 1: GROUP MODERATION & ACTIVITY LOGGING
      if (msg.chat.type.includes("group") || chatId === groupId) {
        handleGroupModeration(msg);
        
        // Activity Check: Look for #FGHActivity in the replied-to message
        if (msg.reply_to_message && (msg.reply_to_message.caption || msg.reply_to_message.text)) {
          var context = msg.reply_to_message.caption || msg.reply_to_message.text;
          if (context.includes("#FGHActivity")) {
            var activityTitle = context.split("\n")[0]; // Use first line as Title
            logTGActivity(activityTitle, userId, text, "Pending");
          }
        }
        return;
      }

      // BOT 2: PRIVATE CONCIERGE
      if (msg.chat.type === "private") {
        if (msg.contact) {
          saveContact(userId, msg.from.first_name, msg.contact.phone_number, msg.from.username);
          sendSuccessMenu(chatId);
          return;
        }

        if (text === "/start") return sendNewSubscriberGate(chatId);
        if (text === "/claimrewards") return processRewardClaim(chatId, userId);
        
        // FGH Username Detection
        if (/^(ANA|ANO|ANM|ANI|ANA)/i.test(text.trim())) {
          updateFGHUsername(userId, text.trim().toUpperCase());
          sendBotMessage(tokenBot2, chatId, "✅ **FGH Username Linked Successfully!**");
          return;
        }

        // Keyboard Button Routing
        var clean = text.toUpperCase();
        if (clean.includes("CASH IN/OUT")) sendCashInInfo(chatId);
        else if (clean.includes("PROMO")) sendPromotionsMenu(chatId, false);
        else if (clean.includes("VIP PERKS")) sendVipPerks(chatId);
        else if (clean.includes("SUPPORT")) sendSupportMenu(chatId);
      }
    }
  } catch (err) {}
}