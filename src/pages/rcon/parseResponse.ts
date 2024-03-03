function parseRconResponse(buffer: Buffer): string {
  // ヘッダー（長さ、リクエストID、タイプ）をスキップするために10バイト進める
  const messageStart = 12;
  // 終端のnull文字を除いてメッセージを取得
  const messageEnd = buffer.length - 2;
  // メッセージ部分を抽出して文字列に変換
  const message = buffer.toString('utf8', messageStart, messageEnd);
  return message;
}

export default parseRconResponse;