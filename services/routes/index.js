var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require("fs")
var config = require("../../config/config.json")
const FONTS_DIR = path.join(process.cwd(), "upload", "fonts")
const STICKERS_DIR = path.join(process.cwd(), "upload", "stickers")
const CONFIG_DIR = path.join(process.cwd(), "upload", "config")
/* GET home page. */
//'w.Write([]byte(`{"version": " + BackendVersion + ", "config": {"enableTranslate":  + strconv.FormatBool(EnableTranslate) + }}))'
router.get('/server_info', function (req, res, next) {
  res.json({
    version: config["version"],
    config: {
      enableTranslate: false
    }
  })
});

router.post('/font_upload', function (req, res, next) {
  if (req.files === null) {
    return res.status(400).json({ msg: 'no file uploaded' });
  }

  const file = req.files.file;
  const file_name = "userdefine_" + file.name
  const file_path = path.join(FONTS_DIR, file_name)
  file.mv(file_path, err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/upload/fonts/${file_name}` });
  });

});


router.post('/sticker_upload', function (req, res, next) {
  if (req.files === null) {
    return res.status(400).json({ msg: 'no file uploaded' });
  }

  const file = req.files.file;
  const file_name = file.name
  const file_path = path.join(STICKERS_DIR, file_name)
  file.mv(file_path, err => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: file.name, filePath: `/upload/stickers/${file_name}` });
  });

});


router.post('/css_upload', function (req, res, next) {
  fs.writeFile(path.join(CONFIG_DIR, "dd.css"), req.body.cssPayload, function (err) {
    if (err) return res.status(500).send(err);
    res.json({ iRet: 0 })
  })
});


router.get('/stickers_list', function (req, res, next) {
  fs.readdir(STICKERS_DIR, (err, files) => {
    if (!files) return res.json([])
    let res_arr = []
    files.forEach(e => {
      res_arr.push({
        url: `/upload/stickers/${e}`,
        name: e
      })
    })
    res.json(res_arr)
  })
});


router.get('/fonts_list', function (req, res, next) {
  fs.readdir(FONTS_DIR, (err, files) => {
    if (!files) return res.json([])
    let res_arr = []
    files.forEach(e => {
      res_arr.push({
        url: `/upload/fonts/${e}`,
        name: e.replace(new RegExp(".ttf|.otf|.ttc"), "")
      })
    })
    res.json(res_arr)
  })
});


router.post('/add_account', function (req, res, next) {
  fs.writeFileSync(path.join(CONFIG_DIR, "users.json"), JSON.stringify(req.body))
  res.json({ iRet: 0 })

});


router.get('/logininfo', function (req, res, next) {
  let ret = []
  try {
    const json = JSON.parse(fs.readFileSync(path.join(CONFIG_DIR, "users.json")).toString("utf-8"))
    if (json.accounts) {
      ret = json.accounts
    }
  } catch (error) {
    ret = []
  }
  res.json(ret)
});


router.get('/version', function (req, res, next) {
  return res.json({ version: config.version })
});
module.exports = router;
