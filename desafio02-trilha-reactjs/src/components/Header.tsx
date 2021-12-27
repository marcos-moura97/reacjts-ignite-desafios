
interface Title{
    title: string;
}

export function Header(props: Title){
    
    return(
        <header>
          <span className="category">Categoria:<span> {props.title}</span></span>
        </header>
    )
}