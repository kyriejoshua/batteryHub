/**
 * 数字是否是无限的
 * @param {*} num
 */
export const isNumberInFinite = (num) =>{
  return num + 1 === num;
}

/**
 * 获取充电时间或者可用时间
 * @param {*} isCharged 是否充电
 * @param {*} batteryManager 电源管理
 * @param {*} callback 回调函数
 */
export const getChargingInfoText = (isCharged, batteryManager = {}, callback) => {
  const chargingTime = isCharged ? batteryManager.chargingTime : batteryManager.dischargingTime;

  /**
   * 返回文案
   */
  return () => {
    const isInFinite = isNumberInFinite(batteryManager.dischargingTime);
    if (isInFinite) { return; }
    const title = isCharged ? '剩余充电时间：' : '剩余可使用时间：';
    const text = getChargingInfoTextByTime(chargingTime);
    const notiText = `${title}${text}`;
    callback && callback(notiText, { body: '🔋🔋🔋' });

    return notiText;
  }
};

/**
 * 充电时间或可用时间的格式化
 * @param {*} time
 */
export const getChargingInfoTextByTime = (time = 0) => {
  if (!time) {
    return '';
  }
  const mintes = time / 60;
  let text = mintes + '分钟';
  if (mintes > 60) {
    const minte = mintes % 60;
    const hours = window.parseInt(mintes / 60);
    text = `${hours}小时 ${minte}分钟`;
  }
  return text;
}
