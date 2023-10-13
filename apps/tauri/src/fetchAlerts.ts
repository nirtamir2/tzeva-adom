import axios from "axios";

const prodApiConfig = {
  // The response type is "" (for no alerts) or alerts json, so if "" we don't want to fail
  silentJSONParsing: true,

  method: "get",
  maxBodyLength: Infinity,
  url: "https://www.oref.org.il/WarningMessages/alert/alerts.json",
  headers: {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
    "Content-Type": "application/json;charset=utf-8",
    Cookie:
      "Lastalerts=; zdSessionId_98861531=cfdc5d30-d1ff-4fb8-8df8-87cf8b6c0068; 98861531-ehtoken=SharedAccessSignature sr=http%3A%2F%2Fprod-sb-appanalytics-us1.servicebus.windows.net%2F&sig=JyBRpxad7L7n5sVgh2uDrMdHeoHgBlwS1kbrsLoeVe4%3D&se=1683846774&skn=all, Lastalerts=; zdSessionId_98861531=cfdc5d30-d1ff-4fb8-8df8-87cf8b6c0068; 98861531-ehtoken=SharedAccessSignature sr=http%3A%2F%2Fprod-sb-appanalytics-us1.servicebus.windows.net%2F&sig=JyBRpxad7L7n5sVgh2uDrMdHeoHgBlwS1kbrsLoeVe4%3D&se=1683846774&skn=all",
    DNT: "1",
    "If-Modified-Since": "Thu, 11 May 2023 23:01:51 GMT",
    "If-None-Match": 'W/"cf478925c84d91:0"',
    Referer: "https://www.oref.org.il/12481-he/Pakar.aspx",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Chromium";v="113", "Not-A.Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    // If they want to rate limit me - so here is a filter for them to use
    "x-source-app": "Tzeva-Adom-App"
  }
};

/**
 * {
 *   "id": "133284761430000000",
 *   "cat": "1",
 *   "title": "ירי רקטות וטילים",
 *   "data": [
 *     "דקל",
 *     "כרם שלום",
 *     "יתד",
 *     "שדה אברהם"
 *   ],
 *   "desc": "היכנסו למרחב המוגן ושהו בו 10 דקות"
 * }
 */
// OR we get "" as string
export type RealPikudHaorefAPIAlertResponse = {
  id: string;
  cat: "1" | (string & {});
  title: string;
  data: Array<string>;
  desc: "היכנסו למרחב המוגן ושהו בו 10 דקות" | (string & {});
};

// {
//   "id": "133284764400000000",
//   "cat": "1",
//   "title": "ירי רקטות וטילים",
//   "data": [
//   "נירים"
// ],
//   "desc": "היכנסו למרחב המוגן ושהו בו 10 דקות"
// }

function generateRocketMock(data: Array<string>) {
  return {
    id: "133284768890000000",
    cat: "1",
    title: "ירי רקטות וטילים",
    data,
    desc: "היכנסו למרחב המוגן ושהו בו 10 דקות"
  };
}

/**
 * {
 *   "id": "133284768890000000",
 *   "cat": "1",
 *   "title": "ירי רקטות וטילים",
 *   "data": [
 *     "נחל עוז",
 *     "חולון",
 *     "ראשון לציון - מערב"
 *   ],
 *   "desc": "היכנסו למרחב המוגן ושהו בו 10 דקות"
 * }
 * @param fetch
 * @param onMessage
 */

export async function fetchAlerts(): Promise<
  RealPikudHaorefAPIAlertResponse | "\n"
> {
  if (
    import.meta.env.NODE_ENV === "production" ||
    // @ts-ignore
    import.meta.env.VITE_USE_PRODUCTION_API === "true"
  ) {
    const apiResponse = await axios.request(prodApiConfig);
    const responseData: RealPikudHaorefAPIAlertResponse | "\n" =
      apiResponse.data;

    return responseData;
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  switch (Date.now() % 6) {
    case 0:
      return generateRocketMock([
        "זיקים",
        "נחל עוז",
        "חולון",
        "ראשון לציון - מזרח",
        "אשקלון",
        "בית שמש",
        "יד מרדכי",
        "נירים",
        "כרם שלום",
        "ראשון לציון - מערב"
      ]);
    case 1:
      return generateRocketMock(["נחל עוז", "חולון"]);
    case 2:
      return generateRocketMock(["נחל עוז", "אשקלון"]);
    case 3:
      return generateRocketMock(["זיקים"]);
    case 4:
      return generateRocketMock([
        "זיקים",
        "נחל עוז",
        "חולון",
        "ראשון לציון - מזרח",
        "אשקלון",
        "בית שמש",
        "יד מרדכי",
        "נירים",
        "כרם שלום",
        "ראשון לציון - מערב"
      ]);
    case 5: {
      return {
        id: "1332847688900000001",
        cat: "2", //fake category
        title: "חדירת כלי טיס",
        data: ["יד מרדכי"],
        desc: "היכנסו למרחב המוגן ושהו בו 10 דקות"
      };
    }
    default:
      return "\n";
  }
}
