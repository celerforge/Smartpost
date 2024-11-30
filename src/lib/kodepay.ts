import { Kodepay } from "kodepay";
import { KODEPAY_APPLICATION_ID, KODEPAY_CLIENT_ID, KODEPAY_MODE } from "./env";

export function getKodepayClient() {
  return Kodepay.kodepay({
    application_id: KODEPAY_APPLICATION_ID,
    client_id: KODEPAY_CLIENT_ID,
    mode: KODEPAY_MODE,
  });
}
