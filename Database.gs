var sheetId = "1LoUAUuzaE9Lr8KAByX6CB5Fh0cDqXCUHwiArm7Mt2mE";

function saveContact(userId, name, phone, username) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("TG CONTACTS");
  var userHandle = username ? "@" + username : "No Username";
  // A:ID | B:NAME | C:PHONE | D:USER | E:DATE | F:LEADS | G:FGH_USER | H:STR_STAT | I:REASON
  sheet.appendRow([userId, name, phone, userHandle, new Date(), "Interested", "", "", ""]);
}

function logTGActivity(title, userId, answer, status) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("TG ACTIVITY LOGS");
  // A:TITLE | B:TIME | C:ID | D:ANSWER | E:STATUS
  sheet.appendRow([title, new Date(), userId, answer, status]);
}

function handleGroupModeration(msg) {
  var userId = msg.from.id.toString();
  var text = (msg.text || "").toLowerCase();
  var banned = [
  "putang ina mo", "gago", "bullshit", "tanginamo", "bwisit", "buyset", 
  "kupal", "fuck you", "lintik", "leche", "mother fucker", "ulol", 
  "ina mo", "hayop", "hayup", "gagu", "scam", "scammer", "putcha", 
  "putsa", "tarantado", "shit", "tanga", "bobo", "fuck"
];
  
  if (banned.some(w => text.includes(w))) {
    deleteMessage(tokenBot1, msg.chat.id, msg.message_id);
    var strikeCount = updateStrike(userId);
    var warning = "🚫 **PROFANITY DETECTED**\nUser: " + userId + "\nStrike: " + strikeCount;
    sendBotMessage(tokenBot1, msg.chat.id, warning);
    if (strikeCount >= 3) kickUser(tokenBot1, msg.chat.id, userId);
  }
} 
  // Inside handleGroupModeration
  if (banned.some(w => text.includes(w)) || text.includes("http://") || text.includes("https://")) {
   // This will now catch the banned words AND any outside links!
   deleteMessage(tokenBot1, msg.chat.id, msg.message_id);
   // ... continue with strike logic
}

function updateStrike(userId) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("TG CONTACTS");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === userId) {
      var count = (data[i][7] || 0) + 1;
      sheet.getRange(i + 1, 8).setValue(count);
      return count;
    }
  }
  return 1;
}

function processRewardClaim(chatId, userId) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("TG ACTIVITY LOGS");
  var data = sheet.getDataRange().getValues();
  var isWinner = data.some(row => row[2].toString() === userId && row[4] === "WINNER");
  
  if (isWinner) {
    var winMsg = "🎊 **CONGRATULATIONS!** You are a confirmed winner!\n\nPlease send your **FGH Username** (e.g., ANO12345) to link your reward.";
    sendBotMessage(tokenBot2, chatId, winMsg);
  } else {
    sendBotMessage(tokenBot2, chatId, "❌ Sorry, you do not have any pending rewards. Try again next time!");
  }
}

// API WRAPPERS
function sendBotMessage(token, cid, txt, kb) {
  var payload = {chat_id: cid, text: txt, parse_mode: "Markdown", reply_markup: kb};
  UrlFetchApp.fetch("https://api.telegram.org/bot"+token+"/sendMessage", {method:"post", contentType:"application/json", payload:JSON.stringify(payload)});
}

function sendPhoto(cid, url, cap, kb) {
  var payload = {chat_id: cid, photo: url, caption: cap, parse_mode: "Markdown", reply_markup: kb};
  UrlFetchApp.fetch("https://api.telegram.org/bot"+tokenBot2+"/sendPhoto", {method:"post", contentType:"application/json", payload:JSON.stringify(payload)});
}

function editPhoto(cid, mid, url, cap, kb) {
  var payload = {chat_id: cid, message_id: mid, media: {type: "photo", media: url, caption: cap, parse_mode: "Markdown"}, reply_markup: kb};
  UrlFetchApp.fetch("https://api.telegram.org/bot"+tokenBot2+"/editMessageMedia", {method:"post", contentType:"application/json", payload:JSON.stringify(payload)});
}

function deleteMessage(t, cid, mid) { UrlFetchApp.fetch("https://api.telegram.org/bot"+t+"/deleteMessage?chat_id="+cid+"&message_id="+mid); }
function kickUser(t, cid, uid) { UrlFetchApp.fetch("https://api.telegram.org/bot"+t+"/banChatMember?chat_id="+cid+"&user_id="+uid); }