import React, { useState } from 'react';

const RconCommandSender = () => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [password, setPassword] = useState('');
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');

  const sendRconCommand = async () => {
    const requestBody = {
      host,
      port: Number(port), // 文字列から数値に変換
      password,
      command,
    };

    try {
      const res = await fetch('/api/rcon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error('サーバーエラー');
      }

      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error('RCONコマンドの送信に失敗しました。', error);
      setResponse('エラーが発生しました。');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-2">
        <input
          type="text"
          value={host}
          name='host'
          onChange={(e) => setHost(e.target.value)}
          placeholder="IPアドレス"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          value={port}
          name='port'
          onChange={(e) => setPort(e.target.value)}
          placeholder="ポート番号"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          value={password}
          name='password'
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={command}
          name='command'
          onChange={(e) => setCommand(e.target.value)}
          placeholder="コマンド"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <button onClick={sendRconCommand} className="btn btn-primary">
        RCONコマンドを送信
      </button>
      <div className="mt-4">レスポンス: {response}</div>
    </div>
  );
};

export default RconCommandSender;
