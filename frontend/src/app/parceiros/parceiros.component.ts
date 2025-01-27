
import { Produto } from './../model/Produto';
import { AuthService } from './../service/auth.service';
import { UserLogin } from './../model/UserLogin';
import { UsuariosService } from './../service/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faHeart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { User } from '../model/User';
import { ProdutosService } from '../service/produtos.service';


@Component({
  selector: 'app-parceiros',
  templateUrl: './parceiros.component.html',
  styleUrls: ['./parceiros.component.css']
})
export class ParceirosComponent implements OnInit{

  user: User = new User()
  produto: Produto = new Produto()
  listaProdutos: Produto[]
  listaUser: User[]
  userLogin: UserLogin = new UserLogin
  carrinho: Produto[]
  quant: number
  vParcial: number

  constructor(
    private router: Router,
    private produtoService: ProdutosService,
    private usuarioService: UsuariosService,
    public authService: AuthService,
    public route: ActivatedRoute


  ) { }

  ngOnInit() {
    window.scroll(0,0)
    let id = this.route.snapshot.params['id']
    this.findByIdUser(id)
    this.quant = 1
    this.vParcial = this.produto.preco
  }

  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faHeart = faHeart;
  faCircleInfo = faInfoCircle



  findByIdUser(id: number){
    this.usuarioService.getByIdUsuario(id).subscribe((resp: User) => {
      this.user = resp
    })
  }

  cadastrarProdutos() {
    if (environment.token == '') {
      this.router.navigate(['/entrar'])
    }

    this.produto.usuario = this.user
    console.log(this.produto)

    this.produtoService.postProdutos(this.produto).subscribe((resp: Produto)=> {
        this.produto = resp
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Produto cadastrado com sucesso!',
          confirmButtonColor: '#FECE2D'
        })
        this.produto = new Produto

    })
  }




//Carrinho//
  process(value: number) {
    value += this.quant;
    if (value < 1) {
      this.quant = 1;
    } else if (value >= (this.produto.quantidade - 1)) {
      this.quant = (this.produto.quantidade - 1);
    } else {
      this.quant = value;
    }
  }

  parcial() {
    this.vParcial = this.produto.preco * this.quant
    return this.vParcial
  }

  addCarrinho() {
      this.parcial()
      this.carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]')

      this.carrinho.push(
        {
          id: this.produto.id,
          nome: this.produto.nome,
          imagem: this.produto.imagem,
          preco: this.produto.preco,
          descricao: this.produto.descricao,
          usuario: this.produto.usuario,
          quantidade: this.quant,
          valorParcial: this.vParcial
        })
      localStorage.setItem('carrinho', JSON.stringify(this.carrinho))
      Swal.fire({
        icon: 'success',
        title: 'Boa!',
        text: 'Produto adicionado com sucesso!',
        confirmButtonColor: '#FECE2D'
      })

    }
    //carrinho//


  }


  //comprar(){
    //this.produtoCompra = environment.produto
    //this.produtoService.getByIdProdutos(this.produto.id).subscribe((resp: Produto) => {
     // this.produto = resp
 // })
//}

