# Script auxiliar para publicar los dos repositorios en GitHub (Backend y Frontend)
# Autor: Daniel Morales - Entrega 3 Full-Stack NIDO

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      NIDO Full-Stack - Asistente de Publicación Git      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Publicar rama principal del proyecto actual
Write-Host "`n[1/3] Subiendo commits actuales a GitHub (rama landing-nido)..." -ForegroundColor Yellow
git push origin landing-nido

# 2. Instrucciones para Backend
Write-Host "`n[2/3] Para publicar el Backend en su propio repositorio:" -ForegroundColor Green
Write-Host "1. Entra a https://github.com/new y crea un repositorio llamado: nido-backend"
Write-Host "2. En una terminal nueva, ejecuta:"
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   git init" -ForegroundColor Gray
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'feat: initial commit nido api rest'" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/danijm1207/nido-backend.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray

# 3. Instrucciones para Frontend
Write-Host "`n[3/3] Para conectar el Frontend en Vercel:" -ForegroundColor Green
Write-Host "1. En tu proyecto de Vercel, en 'Root Directory', asegúrate de apuntar a: frontend (o importar nido-frontend si creas un repo separado)."
Write-Host "2. Configura la variable de entorno:"
Write-Host "   NEXT_PUBLIC_API_HOST=https://tu-api-backend.onrender.com/api" -ForegroundColor Yellow

Write-Host "`nListo! Todo el codigo y documentacion estan completos al 100%." -ForegroundColor Cyan
