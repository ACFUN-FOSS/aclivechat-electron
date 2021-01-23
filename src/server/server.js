/*
 * @Date: 2020-09-16 20:40:58
 * @LastEditors: kanoyami
 * @LastEditTime: 2020-09-16 21:02:48
 */
const express = require("express");

export default () => {
  const app = express();
  const port = 3000;
    app.use('/',express.static('/static'))
     

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
