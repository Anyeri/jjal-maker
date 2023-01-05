// ES6+ 디스트럭처링 문법 적용: (props) -> ({img}) JS 그대로 넣어도 된다.
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
    const heartIcon = alreadyFavorite ? "💖" : "🤍";

    return (
        <div className="main-card">
            <img src={img} alt="냥이" width="400" />
            <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    );
};

export default MainCard;