import { isNumberInFinite, getChargingInfoText } from './utils';

const Noti = Notification;

export const NOTIFICATION_STATUS = {
  GRANTED: 'granted'
};

/**
 * 默认 ICON 地址
 */
export const IconUrl = 'https://raw.githubusercontent.com/elrumo/macOS_Big_Sur_icons_replacements/master/icons/png/low-res/Battery_Monitor.png';

/**
 * 封装新建通知方法
 * @param {*} title
 * @param {*} options
 */
export const createANoti = (title, options = { body: '', icon: IconUrl }) => {
  return new Noti(title, options);
}

/**
 * 获取一些基本信息
 * @param {*} batteryManager
 */
export const getBatteryBasicInfo = (batteryManager) => {
  const isBatteryCharged = batteryManager.charging;
  const batteryChargingStatusText = isBatteryCharged ? '正在充电中 👉👉👉' : '正在断电中 👉👉👉';
  const currentBatteryLevelText = "电量信息: " + batteryManager.level * 100 + "%";
  const batteryChargingTime = isBatteryCharged ? batteryManager.chargingTime : batteryManager.dischargingTime
  const isInFinite = isNumberInFinite(batteryChargingTime);
  const batteryChargingText = isInFinite ? '没啥可说的……一切都好' : getChargingInfoText(isBatteryCharged, batteryManager)() || '没啥可说的……一切都好';
  const batteryBasicInfoText = `${batteryChargingStatusText} ${currentBatteryLevelText}`;
  console.info(batteryManager);

  return {
    batteryBasicInfoText,
    batteryChargingText
  };
}

/**
 * 获取电池信息后的回调事件
 * @param {*} batteryManager
 */
export const handleBattery = (batteryManager) => {
  const { batteryBasicInfoText, batteryChargingText } = getBatteryBasicInfo(batteryManager);

  // 显示基本信息的通知
  createANoti(batteryBasicInfoText, { body: batteryChargingText });

  batteryManager.addEventListener('chargingchange', function() {
    const isBatteryCharged = batteryManager.charging;
    const batteryChargingStatusText = isBatteryCharged ? '充电啦 👇👇👇' : '断电啦 👇👇👇';
    const batteryLevelText = `当前电量: ${batteryManager.level * 100}%`;

    createANoti(batteryChargingStatusText, {body: batteryLevelText }); // 显示通知
  });

  batteryManager.addEventListener('levelchange', function() {
    const batteryLevel = batteryManager.level;
    const batteryLevelText = `剩余电量: ${batteryLevel}%`;
    console.log("电量: " + batteryLevelText + "%");

    if (batteryLevel % 5 === 0) {
      createANoti("又掉电啦", { body: batteryLevelText }); // 显示通知
    }
  });

  // 充电提示
  const chargingtimechangeCb = getChargingInfoText('chargingtimechange', batteryManager, createANoti);
  batteryManager.addEventListener('chargingtimechange', chargingtimechangeCb);

  // 断电提示
  const dischargingtimechangeCb = getChargingInfoText('dischargingtimechange', batteryManager, createANoti);
  batteryManager.addEventListener('dischargingtimechange', dischargingtimechangeCb);
}

/**
 * 获取全局通知权限
 * 得到确认后发送一条测试消息
 */
export const requestPermission = () => {
  Noti.requestPermission(function(status) {
    status === NOTIFICATION_STATUS.GRANTED && (new Noti("感谢您的允许", { icon: IconUrl })); // 显示通知
    console.log(`currentStatus: ${status}`); // 仅当值为 "granted" 时显示通知
  });
};

/**
 * 获取电池电量等信息
 */
export const getBatteryInfo = () => navigator.getBattery().then(handleBattery);
