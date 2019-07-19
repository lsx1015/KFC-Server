const { override, fixBabelImports,addLessLoader } = require('customize-cra');
module.exports = override(
       fixBabelImports('import', {
         libraryName: 'antd',
         libraryDirectory: 'es',
           style: true,
          // style:'css',
        } ),
        addLessLoader({
          javascriptEnabled: true,
          modifyVars: { '@primary-color': '#BF112C','@link-color': '#F5390B' },
        }), 
);