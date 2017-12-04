import qiniu from 'qiniu'
import config from '../config'
import { exec } from 'shelljs'
qiniu.conf.ACCESS_KEY = config.qiniu.AK
qiniu.conf.SECRET_KET = config.qiniu.SK

const bucket = 'weixin'
export const fetchImage = async (url, key) => {

    // const mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KET);
    // const options = {
    //     scope: bucket,
    //     expires: 7200
    //   };

    // var mac = new qiniu.auth.digest.Mac(qiniu.conf.ACCESS_KEY, qiniu.conf.SECRET_KET);
    // var config = new qiniu.conf.Config();
    // config.zone = qiniu.zone.Zone_z0;
    // var bucketManager = new qiniu.rs.BucketManager(mac, config);
    // bucketManager.fetch(url, bucket, key, function(err, respBody, respInfo) {
    //     if (err) {
    //       console.log(err);
    //       //throw err;
    //     } else {
    //       if (respInfo.statusCode == 200) {
    //         console.log(respBody);
    //       } else {
    //         // console.log(respInfo.statusCode);
    //         console.log(respBody);
    //       }
    //     }
    //   });
    return new Promise((resolve,reject) => {
        const bash = `qshell fetch ${url} ${bucket} '${key}'`
        const child = exec(bash, {async: true})
        child.stdout.on('data', data => {
            console.log(data)
            resolve(data)
        })
    })
}