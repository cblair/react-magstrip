import React, { useEffect } from "react";

// We've commented out some of fields we can match, becasue we have no need for them ATM. Might as well not die if the format is wrong.
//                %  B |card number|   lname   |    fname    |  |   mname  |      |   YY    |   MM    |     |   SC     | Discretionary Data | ?
// Our derivitive:     |card number|   all_names  |   YY    |   MM    |
const ISO7813Format = /([0-9]{1,19})\^([a-zA-Z \/]+)[^^]*\^([0-9]{2})([0-9]{2}).*/;
// If you want to test, paste in this string on a page with this component:
// %B4242424242424242^BLAIR/COLBY               ^23012010000000099000000?;44242424242424242=23012010000009900000?

export default function MagStripe({ onComplete }) {
  let partialData = "";
  let data = "";

  const handleKeyEvent = ({ key }) => {
    if (key === "Enter") {
      data = partialData.replaceAll("Shift", "");
      partialData = "";
      console.debug("data:", {
        rawData: data,
        parsedData: data.match(ISO7813Format),
      });
      let [
        _all,
        card_number = "",
        all_names = "",
        YY = "",
        MM = "",
        service_code = "",
        discretionary_data = "",
      ] = data.match(ISO7813Format) || [];

      // Getting the names isn't as easy as it should be. For different cards, the last/first name are either delimited
      // / chars (the ISO standard) or spaces. Sometimes there's a middle initial at the middle or last.
      let all_names_list = all_names.split(/\/| /);
      all_names = all_names_list.filter((name) => name.length <= 1);
      let [last_name = "", first_name = ""] = all_names_list;

      onComplete({
        card_number,
        last_name,
        first_name,
        YY,
        MM,
        service_code,
        discretionary_data,
      });
    } else {
      partialData += key;
    }
  };

  const handlePasteEvent = (e) => {
    console.debug({ e });
    let clipboardData;
    let pastedData;

    // Stop data actually being pasted in.
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API.
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData("Text");

    console.debug({ pastedData });

    data = pastedData.replaceAll("Shift", "");
    console.debug("data:", {
      rawData: data,
      parsedData: data.match(ISO7813Format),
    });
    let [
      _all,
      card_number = "",
      all_names = "",
      YY = "",
      MM = "",
      service_code = "",
      discretionary_data = "",
    ] = data.match(ISO7813Format) || [];
    // Getting the names isn't as easy as it should be. For different cards, the last/first name are either delimited
    // / chars (the ISO standard) or spaces. Somtimes there's a middle initial at the middle or last.
    let all_names_list = all_names.split(/\/| /);
    all_names = all_names_list.filter((name) => name.length <= 1);
    const [last_name = "", first_name = ""] = all_names_list;
    onComplete({
      card_number,
      last_name,
      first_name,
      YY,
      MM,
      service_code,
      discretionary_data,
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyEvent);
  }, []);
  useEffect(() => {
    document.addEventListener("paste", handlePasteEvent);
  }, []);
  // componentWillUnmount - we have to remove all the event listeners, or over time we get a ton of
  // callbacks.
  useEffect(() => {
    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
      document.removeEventListener("paste", handlePasteEvent);
    };
  }, []);

  return null;
}
