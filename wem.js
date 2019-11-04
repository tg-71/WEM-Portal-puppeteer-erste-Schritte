const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false //True setzten für wirklich headless ;o)
  });
  //neue Seite 
  const page = await browser.newPage();
  await page.goto("https://www.wemportal.com/Web/");
  
  //Benutzername + Passwort
  await page.type("#ctl00_content_tbxUserName", "++++UserName");
  await page.type("#ctl00_content_tbxPassword", "++++PassWord");

  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click("#ctl00_content_btnLogin") // Click "Anmelden"
  ]);

  await page.screenshot({ path: "example.png" });

  // UpdateInfo Datum auslesen 
  // schreibt Datum und Uhrzeit erstmal in die Console
  // möchte später noch irgendwie auswerten ob die angezeigten Daten UpToDate sind.
  // je nach Tageszeit dauert das synchronieren ganz schön lange 
  // noch Baustelle
  console.log(
    await page.evaluate(
      () =>
        document.querySelector(
          "#ctl00_DeviceContextControl1_lblDeviceLastDataUpdateInfo"
        ).textContent
    )
  );

  //Auswerten Benutzer - Info Beispiel Aussentemperatur_Aktuell
  
  var Aussentemperatur_Aktuell = (
    await page.evaluate(
      () =>
        document.querySelector(          "#ctl00_rdMain_C_controlExtension_rptDisplayContent_ctl00_ctl00_rpbGroupData_i0_rptGroupContent_ctl00_ctl00_lwSimpleData_ctrl0_ctl00_lblValue"
        ).textContent
    )
  );
  console.log('Aussentemperatur_Aktuell           :',Aussentemperatur_Aktuell);
  
  //Auswerten Benutzer - Systembetriebsart
  await page.click("#ctl00_rdMain_C_controlExtension_iconMenu_rmMenuLayer > ul > li:nth-child(2) > a");//Systembetriebsart
  await page.waitFor(10000);
  await page.screenshot({ path: "example_system.png" });
 
  
  
  // ++++++++++++++++++++++++ GoTo Fachmann ++++++++++++++++++++++++++++++++++++++++++++
  // Menü "Anlagen" aufklappen
  await page.click("#ctl00_RMTopMenu > ul > li.rmItem.rmFirst > a > span");

  await page.screenshot({ path: "example1.png" });

  // Menü Fachmann auswählen
  await Promise.all([
    page.waitForNavigation(), // The promise resolves after navigation has finished
    page.click("#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(4) > a > span") //(4) Fachmann
	//"#ctl00_SubMenuControl1_subMenu > ul > li.rmItem.rmFirst > a > span" 	= Übersicht
	//"#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(3) > a > span" 	= Benutzer
	//"#ctl00_SubMenuControl1_subMenu > ul > li:nth-child(4) > a > span"	= Fachmann
	//"#ctl00_SubMenuControl1_subMenu > ul > li.rmItem.rmLast > a > span" 	= Datenlogger
  ]);

  // Security code 11
  // "Dialogbox" für die "CodeEingabe Fachmann" ist ein neuer Frame
  // Hab noch nicht geschafft, den Fokus von Puppeteer für die Eingabe (elegant) dorthin zu setzten 
  // 3x TAB funktioniert aber auch ;o)
  await page.waitFor(5000);//warten auf das Dialogfenster
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

  
 
  // Refresh der Daten anstoßen
  await page.waitFor(20000);
  await page.click("#ctl00_DeviceContextControl1_RefreshDeviceDataButton");
  await page.waitFor(10000);
  await page.screenshot({ path: "example4.png" });

  await browser.close();
})();


