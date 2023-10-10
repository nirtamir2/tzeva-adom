import { MessageT, MessageType } from "@tzeva-adom/core";
import { areaDataMap } from "./areaDataMap";
import axios, { isAxiosError } from "axios";

function getUnknownCity(alertArea: string) {
  return {
    name: alertArea,
    name_en: alertArea,
    zone: alertArea,
    zone_en: alertArea,
    time: "לא ידוע",
    time_en: "unknown",
    countdown: 0,
    lat: 32.958,
    lng: 35.172,
    value: alertArea
  };
}

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
type RealPikudHaorefAPIAlertResponse = {
  id: string;
  cat: "1";
  title: "ירי רקטות וטילים";
  data: Array<string>;
  desc: "היכנסו למרחב המוגן ושהו בו 10 דקות";
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

function isString(value: unknown): value is string {
  return typeof value === "string" || value instanceof String;
}

function syncProdAlertData({
  onMessage
}: {
  onMessage: (message: MessageT) => void;
}) {
  setInterval(async () => {
    try {
      // @see https://github.com/eladnava/redalert-android/blob/abae40851e50476f2ecda63ad9a4e2b1bf8f117c/app/src/main/java/com/red/alert/activities/Main.java#L423
      const apiResponse = await axios.request(prodApiConfig);
      const responseData: RealPikudHaorefAPIAlertResponse | "\n" =
        apiResponse.data;

      // The API returns an empty string if there are no alerts
      if (isString(responseData)) {
        onMessage({
          type: MessageType.EmptyAlert
        });
        return;
      }

      onMessage({
        type: MessageType.Alert,
        alert: {
          id: Number(responseData.id),
          data: responseData.data.map((city) => {
            // @see https://github.com/eladnava/redalert-android/blob/abae40851e50476f2ecda63ad9a4e2b1bf8f117c/app/src/main/java/com/red/alert/activities/Main.java#L468
            // const date = d.date * 1000;
            return areaDataMap[city] ?? getUnknownCity(city);
          })
        }
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 403) {
          onMessage({
            type: MessageType.IPError
          });
          return;
        }
        // Unknown axios error
        onMessage({
          type: MessageType.Error
        });
        return;
      }
      // Error not by axios
      onMessage({
        type: MessageType.Error
      });
    }
  }, 1000);
}

function getMockMessage(index: number): MessageT {
  if (index === 0) {
    return {
      type: MessageType.EmptyAlert
    };
  }
  const cities =
    index === 1
      ? ["נחל עוז", "כיסופים"]
      : index === 2
      ? ["כיסופים"]
      : ["נתיב העשרה", "כרמיה", "זיקים"];

  return {
    type: MessageType.Alert,
    alert: {
      id: Date.now(),
      data: cities.map((city) => {
        return areaDataMap[city] ?? getUnknownCity(city);
      })
    }
  };
}

let index = 0;
function syncTestAlertData({
  onMessage
}: {
  onMessage: (message: MessageT) => void;
}) {
  setInterval(() => {
    index++;
    onMessage(getMockMessage(index % 5));
  }, 2000);
}

export function syncAlertData({
  onMessage
}: {
  onMessage: (message: MessageT) => void;
}): void {
  if (
    // @ts-ignore
    import.meta.env.NODE_ENV === "production" ||
    // @ts-ignore
    import.meta.env.VITE_USE_PRODUCTION_API === "true"
  ) {
    syncProdAlertData({ onMessage });
  } else {
    syncTestAlertData({ onMessage });
  }
}
