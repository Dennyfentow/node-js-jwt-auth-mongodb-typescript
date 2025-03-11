import { Router, Application } from 'express';
import { verifySignUp } from '../middlewares';
import * as controller from '../controllers/auth.controller';

export default function(app: Application): void {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = Router();

  router.post(
    "/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  router.post("/signin", controller.signin);

  app.use('/api/auth', router);
} 