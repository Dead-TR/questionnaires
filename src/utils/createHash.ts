export function createHash(length = 6) {
  var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  var text = "";

  for (var i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return text;
}
