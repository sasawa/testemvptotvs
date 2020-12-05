import React, { useEffect, useReducer, useState } from 'react';
import moment from 'moment'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { 
  AppBar,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from '@material-ui/core';
import Axios from 'axios';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateMomentUtils from '@date-io/moment';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  center: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    marginTop: theme.spacing(2),
  },
  paperForm: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2)
  },
  appBarSpacer: theme.mixins.toolbar,
}));

const defaultValues = {
  data_de_abertura: new Date(),
  data_de_finalizacao: new Date(),
  nome_do_leilao:'',
  usuario_responsavel:'',
  valor_inicial:'',
  usado: false,
}
const defaultErrors = {
  data_de_abertura: false,
  data_de_finalizacao: false,
  nome_do_leilao: false,
  usuario_responsavel: false,
  valor_inicial: false,
}

export default function Painel() {
  const classes = useStyles();
  const history = useHistory();
  const [cookie, setCookie, removeCookie] = useCookies(['auth'])
  
  if(!cookie.auth) history.replace('/');

  const reducer = (state,action) =>{
    return {...state, ...action.payload};
  }
  const [leiloes, setLeiloes] = useState([])
  const [formError, setFormError] = useState({...defaultErrors} )

  const [formData, dispatch] = useReducer(reducer, {...defaultValues} )

  const fetchData = async () => {
    const result = await Axios.get('http://localhost:3004/leiloes');
    setLeiloes(result.data);
  };

  useEffect(() => {
    fetchData()
  },[]);

  const validarCampos = () => {
    const erros = {...defaultErrors};
    if(formData.nome_do_leilao === '') {
      erros.nome_do_leilao = true;
    }
    if(formData.usuario_responsavel === '') {
      erros.usuario_responsavel = true;
    }
    if(formData.valor_inicial === '') {
      erros.valor_inicial = true;
    }
    if(!formData.data_de_abertura) {
      erros.data_de_abertura = true;
    }
    if(!formData.data_de_finalizacao) {
      erros.data_de_finalizacao = true;
    }
    setFormError(erros);
    return Object.values(erros).some(Boolean);
  }
  const normalizarData = () => {
    const dados = {...formData}
    dados.data_de_abertura = moment(dados.data_de_abertura).format('DD/MM/YYYY');
    dados.data_de_finalizacao = moment(dados.data_de_abertura).format('DD/MM/YYYY');
    dados.valor_inicial = Number(dados.valor_inicial);
    return dados;
  }
  const registrarLeilao = async () => {
    if(validarCampos()) {
      return;
    }
    await Axios.post('http://localhost:3004/leiloes', normalizarData());
    fetchData()
  }
  const logoff = () => {
    removeCookie('auth')
    history.replace('/')
  }

  return (
    <Container component="main" maxWidth="lg">
      <AppBar color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title} noWrap>
            MVP Leilões
          </Typography>
          <Button color="inherit"
          onClick={()=>logoff()}>Sair</Button>
        </Toolbar>
      </AppBar>
      <div className={classes.appBarSpacer} />
      <Paper className={classes.paperForm}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="nome_do_leilao"
              name="nome_do_leilao"
              label="Nome do Item"
              error={formError.nome_do_leilao}
              fullWidth
              value={formData.nome_do_leilao}
              onChange={(e)=>dispatch({payload:{nome_do_leilao:e.target.value}})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id="usuario_responsavel"
              name="usuario_responsavel"
              label="Usuário responsável"
              error={formError.usuario_responsavel}
              fullWidth
              value={formData.usuario_responsavel}
              onChange={(e)=>dispatch({payload:{usuario_responsavel:e.target.value}})}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              required
              id="valor_inicial"
              name="valor_inicial"
              error={formError.valor_inicial}
              label="Valor Inicial"
              type="number"
              value={formData.valor_inicial}
              onChange={(e)=>dispatch({payload:{valor_inicial:e.target.value}})}
              fullWidth
            />
          </Grid>
          <Grid item sm={2} />
          <Grid item xs={12} sm={2}>
            <MuiPickersUtilsProvider utils={DateMomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Data de Abertura"
                error={formError.data_de_abertura}
                value={formData.data_de_abertura}
                onChange={date => dispatch({payload:{data_de_abertura:date}})}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={2}>
            <MuiPickersUtilsProvider utils={DateMomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Data de finalização"
                error={formError.data_de_finalizacao}
                value={formData.data_de_finalizacao}
                onChange={date => dispatch({payload:{data_de_finalizacao:date}})}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControlLabel
              control={
                <Checkbox color="primary"
                  checked={formData.usado}
                  onChange={e=>dispatch({payload:{usado:e.target.checked}})}
                />
              }
              label="Item usado?"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
          <Button
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={()=>registrarLeilao()}
            >
              Registrar
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Table size="medium" >
          <TableHead>
            <TableRow>
              <TableCell>Data de abertura</TableCell>
              <TableCell>Data de finalização</TableCell>
              <TableCell>Nome do Item</TableCell>
              <TableCell>Usuário responsável</TableCell>
              <TableCell align="right">Valor Inicial</TableCell>
              <TableCell>Produto usado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leiloes.map((leilao) => (
              <TableRow key={leilao.id}>
                <TableCell>{leilao.data_de_abertura}</TableCell>
                <TableCell>{leilao.data_de_finalizacao}</TableCell>
                <TableCell>{leilao.nome_do_leilao}</TableCell>
                <TableCell>{leilao.usuario_responsavel}</TableCell>
                <TableCell align="right">R${leilao.valor_inicial}</TableCell>
                <TableCell>{leilao.usado? 'Sim': 'Não'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
