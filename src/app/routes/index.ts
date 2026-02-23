import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { FaqRoutes } from "../modules/FAQ/faq.routes";
import aboutRouter from "../modules/about/about.route";
import { ContactRoutes } from "../modules/ContactUs/contact.route";
import termsRouter from "../modules/Terms/terms.route";
import privacyPolicyRouter from "../modules/PrivacyPolicy/privacyPolicy.routes";
import { ReviewRoutes } from "../modules/CodeReview/codereview.routes";


const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route:UserRoutes,
  },
  {
    path: "/faq",
    route:FaqRoutes,
  },
  {
    path: "/about",
    route:aboutRouter,
  },
  {
    path: "/contact",
    route:ContactRoutes,
  },
  {
    path: "/terms",
    route:termsRouter,
  },
  {
    path: "/privacy",
    route:privacyPolicyRouter,
  },
  {
    path: "/review",
    route:ReviewRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
