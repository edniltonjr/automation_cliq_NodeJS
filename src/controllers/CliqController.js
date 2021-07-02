const puppeteer = require("puppeteer");
const { promisify } = require("util");
const express = require("express");
const axios = require("axios");
require("dotenv").config();
const { handleJson } = require("../utils/Utils");
const { encontrarChat, enviarMensagem } = require("../utils/cliq");

module.exports = {
  enviarENG: async (req, res) => {
    const { status } = req.query;
    console.log("Obtendo Ultimos Status...");
    const { data } = await axios.get(
      `http://177.37.163.22:5000/status?status=${status}`
    );
    const result = handleJson(data)[0];

    if (result.length > 0) {
      const sleep = promisify(setTimeout);

      (async () => {
        const browser = await puppeteer.launch({
          executablePath: process.env.executablePath,
          userDataDir: process.env.userDataDir,
          headless: process.env.headless === "false" ? false : true,
        });

        const page = await browser.newPage();
        await page.goto(
          "https://accounts.zoho.com/signin?servicename=ZohoChat&serviceurl=/index.do"
        );

        await sleep(1000 * 2);

        const findChat = await encontrarChat(page);

        if (findChat) {
          findChat.click();

          await sleep(1000 * 2);

          await enviarMensagem(page, result);
        }

        process.env.headless === "true"
          ? await browser.close()
          : await sleep(1000 * 300);

        await res.json({
          message: "ENGS enviadas com Sucesso",
          engs: result,
        });
      })();
    } else {
      return res.json({ message: "Sem ENGS a serem enviadas" });
    }
  },

  statusENG: async (req, res) => {
    const { status } = req.query;

    const sleep = promisify(setTimeout);

    (async () => {
      const browser = await puppeteer.launch({
        executablePath: process.env.executablePath,
        userDataDir: process.env.userDataDir,
        headless: process.env.headless === "false" ? false : true,
      });

      const page = await browser.newPage();
      await page.goto(
        "https://projects.zoho.com/portal/fusiondmsprojects#mybugs/0"
      );
      //   await page.screenshot({ path: "example.png" });

      await sleep(1000 * 2);

      await page.waitForTimeout('i[class="zoho-filter"]');

      await page.click('i[class="zoho-filter"]');

      await page.type('input[id="filterSearchBox"]', "Status");

      await sleep(1000 * 2);

      await page.waitForTimeout('i[id="filtarrow_CUSTOM_STATUSID"]');
      await page.click('i[id="filtarrow_CUSTOM_STATUSID"]');

      await sleep(1000 * 2);

      await page.type('input[id="search_CUSTOM_STATUSID"]', status);

      await sleep(1000 * 2);

      await page.waitForTimeout('div[name="checkbox_CUSTOM_STATUSID"]');

      await page.click('div[name="checkbox_CUSTOM_STATUSID"]');

      await page.waitForTimeout('span[data-zpqa="bugtracker_filter_find"]');

      await page.click('span[data-zpqa="bugtracker_filter_find"]');

      await sleep(1000 * 1);

      const table = await page.evaluate(() => {
        const nodeList = Array.from(
          document.querySelectorAll(
            "table tbody.table-group-list tr.projindrow td.customedit div.first-cell-container div.mlt-app-content div.mlt-firstcol-container span"
          )
        );

        const nu_array = nodeList.map((item) => {
          return { eng: item.innerText };
        });

        return nu_array;
      });

      await res.json(table);
    })();
  },
};
