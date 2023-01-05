import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from "./components/Title";
import MainCard from './components/MainCard';
import CatItem from './components/CatItem';

const jsonLocalStorage = { //브라우저 기능. 7일까지 데이터 저장가능
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => { //생성 버튼을 눌렀을때 fetch API 호출
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

//react map
function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div className="favCatImage">사진 위 하트를 눌러 고양이 사진을 저장 해보세요!</div>;
  }
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

//컴포넌트에(const) return 없이 사용 하려면 (); 로 묶으면 된다. 굳이 return 사용 안해도 됨
const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState('');//input에 입력한 값 관리
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력이 불가합니다.")
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === '') { //validation form 검증
      setErrorMessage("빈 값으로 만들 수 없습니다!");
      return;
    }
    updateMainCat(value);
  }
  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요" value={value} onChange={handleInputChange} />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

//(main)
const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  //상태와 초기값 설정, 값을 동적으로 보여주기 위해 씀
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [mainCat, setMainCat] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  async function setInitialCat() {
    const newCat = await fetchCat("Welcome !");//fetch api 데이터 가져오기
    console.log(newCat);
    setMainCat(newCat);
  }
  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);//fetch api 데이터 가져오기
    setMainCat(newCat);


    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    })
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat]
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const alreadyFavorite = favorites.includes(mainCat);

  const counterTitle = counter === null ? "" : counter + "번째";

  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
