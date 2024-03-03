import { NextApiRequest, NextApiResponse } from 'next';
import { Socket } from 'net';
import parseRconResponse from '../rcon/parseResponse';

interface RconRequest {
  host: string;
  port: number;
  password: string;
  command: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { host, port, password, command } = req.body as RconRequest;
    executeRconCommand(host, port, password, command)
      .then((response) => {
        res.status(200).json({ message: response });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function executeRconCommand(host: string, port: number, password: string, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = new Socket();
    client.connect(port, host, () => {
      sendRconPacket(client, 3, password);
    });

    client.on('connect', () => {
      sendRconPacket(client, 2, command);
    });

    client.on('data', (data: Buffer) => {
      const responseMessage = parseRconResponse(data);
      console.log(responseMessage);
      client.destroy();
      resolve(responseMessage);
    });

    client.on('error', (err) => {
      console.error('RCONコマンドの送信中にエラーが発生しました。', err);
      reject(err);
    });

    client.on('close', () => {
      console.log('Connection closed');
    });
  });
}

function sendRconPacket(client: Socket, type: number, body: string): void {
  const requestId = 1;
  const bodyBuffer = Buffer.from(body, 'utf8');
  const length = Buffer.byteLength(bodyBuffer) + 14;
  const packetBuffer = Buffer.alloc(length);

  packetBuffer.writeInt32LE(length - 4, 0);
  packetBuffer.writeInt32LE(requestId, 4);
  packetBuffer.writeInt32LE(type, 8);
  packetBuffer.write(body, 12);
  packetBuffer.writeInt8(0, length - 2);
  packetBuffer.writeInt8(0, length - 1);

  client.write(packetBuffer);
}
