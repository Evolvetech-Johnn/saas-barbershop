# Guia para Sincronizar Repositório Git

## IMPORTANTE: Email para Vercel
Sempre use o email **evolvetechsolutionsldn@gmail.com** para evitar bloqueios nos deploys do Vercel!

## Passo a Passo para Sincronizar:

1. **Feche o IDE e quaisquer programas que estejam acessando o diretório do projeto** (isso libera o arquivo index.lock do git).
2. **Abra um terminal PowerShell ou CMD no diretório**:
   ```powershell
   cd d:\Evolvetech\Webdesign\Projetos\barbearia-saas
   ```
3. **Configure o Git (email para Vercel!)**:
   ```powershell
   git config --global user.email "evolvetechsolutionsldn@gmail.com"
   git config user.email "evolvetechsolutionsldn@gmail.com"
   git config user.name "Evolvetech"
   ```
4. **Remova o arquivo de lock (se existir)**:
   ```powershell
   Remove-Item .git/index.lock -Force -ErrorAction SilentlyContinue
   ```
5. **Inicialize o git (se não estiver inicializado)**:
   ```powershell
   git init
   ```
6. **Adicione o repositório remoto**:
   ```powershell
   git remote add origin https://github.com/Evolvetech-Johnn/saas-barbershop.git
   ```
7. **Adicione os arquivos ao commit**:
   ```powershell
   git add -A
   ```
8. **Crie o commit**:
   ```powershell
   git commit -m "Setup inicial: Fase 1 concluída"
   ```
9. **Renomeie a branch para main**:
   ```powershell
   git branch -M main
   ```
10. **Envie para o repositório remoto**:
    ```powershell
    git push -u origin main --force
    ```
