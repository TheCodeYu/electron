import fs from 'fs'
import path from 'path'
import { app } from 'electron'


/**
 * 初始化设置选项
 */

export const initSetting = ide =>()=>{
  const filename = path.join(app.getPath('userData'), 'setting.json')

  return new Promise((resolve,reject)=>{
    fs.access(filename,fs.constants.R_OK | fs.constants.W_OK,async err =>{
      if(err){
        if(err.code === 'ENOENT'){
          return resolve(await ide.writeSetting())
        }else{
          return reject(err);
        }
      }
      resolve(await dingtalk.readSetting())
    })
  })
}

/**
 * 从文件中读取设置信息
 */
export const readSetting = ide =>()=>{

}

/**
 * 写入设置到文件
 */

export const writeSetting = ide =>()=>{

}
