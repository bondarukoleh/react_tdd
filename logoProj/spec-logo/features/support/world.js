import {setWorldConstructor} from 'cucumber';
import {app} from '../../server/src/app';
import puppeteer from 'puppeteer';

const port = process.env.PORT || 3000;

class World {
  constructor() {
    this.pages = {};
  }

  setPage(name, page) {
    this.pages[name] = page;
  }

  getPage(name) {
    return this.pages[name];
  }

  startServer() {
    this.server = app.listen(port);
  }

  closeServer() {
    Object.keys(this.pages).forEach(name =>
      this.pages[name].browser().close()
    );
    this.server.close();
  }

  async browseToPageFor(role, url) {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    this.setPage(role, page);
  }

  appPage() {
    return `http://localhost:${port}/index.html`;
  }
};

setWorldConstructor(World);
