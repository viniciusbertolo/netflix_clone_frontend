import React, {useEffect, useState} from 'react'
import Tmdb from './Tmdb'
import MovieRow from './components/MovieRow'
import './App.css'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'


export default () => {

  const[movieList, setMovieList] = useState([])

  const [featuredData, setFeaturedData] = useState(null)

  const[blackHeader, setBlackHeader] = useState(false)


  //quando a tela for executada, ele vai fazer a função
  //async espera o resultado
  useEffect(()=>{
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list)

      //só posso pegar o filme em destaque depois que carregar a lista
      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrolListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true)
      }else{
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrolListener);
    return ()=>{
      window.removeEventListener('scroll', scrolListener)
    }
  },[])


  return(
    <div className="page">
      <Header black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      {/* header - destaque -listas - rodapé */}
      <section className="lists">
        {movieList.map((item, key) =>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Desenvolvido com ❤️ por Vinicius <br></br>
        Direitos de imagem para Netflix <br></br>
        Dados extraidos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://pa1.narvii.com/6678/0a6e0bb33101b154ed278d4bc6810a3b78e69c2b_hq.gif" alt="loading" />
      </div>
      }
    </div>

  )
}