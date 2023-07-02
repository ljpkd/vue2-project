/*
    需求:
        1.如果当前用户没有临时id
            那么就是用uuid生成一个临时id

        2.如果当前用户已经有临时id了
            那么就直接复用已有的id

    时效:每次打开项目都需要使用
        具有持久化存储能力的只有localStorage

    目的:每次发送请求,对服务器的数据做任何操作的时候
        都告知对方当前是哪个用户在操作

    uuid生成的唯一临时标识,是跟着电脑走的,他不管你正在使用的是谁,他只看是哪台电脑
*/
import { v4 as uuidv4 } from 'uuid';
function getTempId(){
    const userTempId = localStorage.getItem('userTempId');
    if(userTempId){
        return userTempId;
    }else{
        // 使用uuid生成的临时标记,基本上不会重复
        // 最多就是同一台电脑可能多次生成重复的临时标记
        const newId = uuidv4();
        localStorage.setItem('userTempId',newId);
        return newId
    }
}

export default getTempId;