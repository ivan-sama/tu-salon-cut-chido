import { SessionOptions } from 'express-session';

const sessionConfig: SessionOptions = {
  // Use an array of secrets to support key rotation as an additional security measure.
  secret: [process.env.SESSION_SECRET_1, process.env.SESSION_SECRET_2],
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};

export default sessionConfig;
