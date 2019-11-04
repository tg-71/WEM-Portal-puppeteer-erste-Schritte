const puppeteer = require("puppeteer");

// Refresh = #ctl00_DeviceContextControl1_RefreshDeviceDataButton

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  //neue Seite 
  const page = await browser.newPage();
  await page.goto("https://www.wemportal.com/Web/");
  
  //Benutzername + Passwort
  await page.type("#ctl00_content_tbxUserName", "++++Hier Username eintragen");
  await page.type("#ctl00_content_tbxPassword", "++++Hier Passwort eintragen");

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click("#ctl00_content_btnLogin") // Click "Anmelden"
  ]);

  await page.screenshot({ path: "example.png" });

  // UpdateInfo Datum auslesen
  console.log(
    await page.evaluate(
      () =>
        document.querySelector(
          "#ctl00_DeviceContextControl1_lblDeviceLastDataUpdateInfo"
        ).textContent
    )
  );

  // ++++++++++++++++++++++++ GoTo Fachmann ++++++++++++++++++++++++++++++++++++++++++++
  // Menü "Anlagen" aufklappen
  await page.click("#ctl00_RMTopMenu > ul > li.rmItem.rmFirst > a > span");

  await page.screenshot({ path: "example1.png" });

  // Menü Fachmann
  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click("#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(4) > a > span") //(4) Fachmann
	//"#ctl00_SubMenuControl1_subMenu > ul > li.rmItem.rmFirst > a > span" 	= Übersicht
	//"#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(3) > a > span" 	= Benutzer
	//"#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(4) > a > span"	= Fachmann
	//"#ctl00_SubMenuControl1_subMenu > ul > li.rmItem.rmLast > a > span" 	= Datenlogger
  ]);

  // Security code 11
  await page.waitFor(5000);
  await page.screenshot({ path: "example2.png" });
  await page.keyboard.press("Tab");
  await page.waitFor(100);
  await page.keyboard.press("Tab");
  await page.waitFor(100);
  await page.keyboard.press("Tab");
  await page.waitFor(100);
  await page.keyboard.type("11");
  await page.screenshot({ path: "example3.png" });
  await page.keyboard.press("Enter");

  // await page.type('#ctl00_DialogContent_tbxSecurityCode', '11')
  // await Promise.all([
  //   page.waitForNavigation(), // The promise resolves after navigation has finished
  //   page.click('#ctl00_DialogContent_BtnSave') // Clicking the link will indirectly cause a navigation
  // ]);

  await page.waitFor(20000);
  await page.click("#ctl00_DeviceContextControl1_RefreshDeviceDataButton");
  await page.waitFor(10000);
  await page.screenshot({ path: "example4.png" });

  await browser.close();
})();

//  document.querySelector("#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(4) > a > span")
