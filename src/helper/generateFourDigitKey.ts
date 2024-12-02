export function GenerateFourDigitKey(){
  const randomFourDigitKey =  Math.ceil(Math.random()*10000)
  if(randomFourDigitKey < 1000){
    GenerateFourDigitKey()
  }else{
    console.log(randomFourDigitKey);
    return randomFourDigitKey
  }
}