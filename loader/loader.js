// import { getOptions } from 'loader-utils';
const { getOptions } = require('loader-utils');

module.exports = function loader(source) {
    const options = getOptions(this);

    console.log(options);

    console.log(source);

    source = source.replace(/aaa/g, 'bbb');

    return source;
}
