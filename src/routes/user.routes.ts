import { Router, Application } from 'express';
import { authJwt } from '../middlewares';
import * as controller from '../controllers/user.controller';

export default function(app: Application): void {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const router = Router();

  router.get("/all", controller.allAccess);

  router.get(
    "/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  router.get(
    "/accept-terms",
    [authJwt.verifyToken],
    controller.acceptTerms
  );

  router.get(
    "/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  router.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.use('/api/user', router);
} 