# GAFio
Sistema de controle de antibióticos que permite à gestão de antibióticos no âmbito da fundação provendo controle, notificações e comunicação do sistema com interfaces externas. A interação será via Desktops e Smartphones.

# Instalação de dependências

//Backend

Na pasta server, instale as seguintes dependências

npm install bcrypt knex cors jsonwebtoken

npm install mysql --save

npm install @types/cors @types/bcrypt -D

npm install @types/jsonwebtoken

Para executar a aplicação, npm run dev

//Frontend

Na pasta webserver, instale as seguintes dependências

npm install react-router-dom axios react-icons react-cookie react-bootstrap

npm install primereact primeicons --save

npm install @types/react-router-dom

Para executar a aplicação, npm start

# Useful sources to develop

https://github.com/aspto/base-de-dados-de-medicamentos -> Base de dados de medicamentos

https://github.com/Atiladanvi/cid10-api -> Doenças API Github

http://videbula.far.br/banco-de-dados-anvisa/ -> Banco de dados ANVISA, dispositivos médicos

https://data.medicare.gov/developers -> Sistema de saúde publica dos EUA para developers

https://www.who.int/data/gho/info/gho-odata-api -> API da WHO/OMS

https://sourceforge.net/projects/contentservices/ -> API do departamento de saude dos EUA.
