import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box, Paper } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  center: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6px 18px'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const [cookie, setCookie, removeCookie] = useCookies(['auth'])
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [desativado, setDesativado] = useState(false);
  const [invalido, setInvalido] = useState(false);

  const realizarLogin = async () => {
    if(user ==="admin" && pass ==="admin") {
      setCookie('auth', 'admin')
      history.replace({pathname:"/painel"});
    } else if (user === 'desativado' && pass === 'desativado') {
      setDesativado(true);
      setInvalido(false);
    } else {
      setInvalido(true);
      setDesativado(false);
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.center}>
        <Typography component="h1" variant="h2">
          MVP Leilões
        </Typography>
        <Paper variant="outlined"  className={classes.paper}>
          <Box className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="nome_usuario"
              label="Nome de usuario"
              name="nome_usuario"
              autoFocus
              error={desativado||invalido}
              value={user}
              onChange={e=>{
                setUser(e.target.value)
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              error={desativado||invalido}
              value={pass}
              autoComplete="current-password"
              onChange={e=>{
                setPass(e.target.value)
              }}
            />
            <Typography color="error" component="h4" variant="subtitle1">
              {invalido ? "Usuario Invalido" : ""}
              {desativado ? "Usuario Desativado" : ""}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={!user || !pass}
              className={classes.submit}
              onClick={()=>realizarLogin()}
            >
              Acessar
            </Button>
          </Box>
        </Paper>
      </div>
    </Container>
  );
}
