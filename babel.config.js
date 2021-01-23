/*
 * @Date: 2020-09-15 19:37:42
 * @LastEditors: kanoyami
 * @LastEditTime: 2020-09-16 00:05:32
 */
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
