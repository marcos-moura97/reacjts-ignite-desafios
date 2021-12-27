import { Button } from "./Button";

import '../styles/sidebar.scss';
interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

type SetState = React.Dispatch<React.SetStateAction<number>> 

interface Genres{
  genres: GenreResponseProps[];
  id: number;
  setId: SetState;
}


export function SideBar(props: Genres) {  

  // Chamo o Hook do componente pai aqui
  function handleClickButton(id: number) {
    props.setId(id);
  }

  return (
    
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>
      <div className="buttons-container">
        {props.genres.map(genre => (
          <Button
            key={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => handleClickButton(genre.id)}
            selected={props.id === genre.id}
          />
        ))}
      </div>
    </nav>
  )
}