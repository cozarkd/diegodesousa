#!/bin/bash

# Obtener la fecha actual
month=$(date +'%-m')  # Use %-m to remove leading zero
day=$(date +'%-d')    # Use %-d to remove leading zero

# Lógica condicional para diferentes estaciones y eventos
if [[ ( "$month" -eq 12 && "$day" -ge 1 ) || ( "$month" -eq 1 && "$day" -le 6 ) ]]; then
  period="Navidad"
elif [[ "$month" -eq 1 && "$day" -eq 7 ]]; then
  period="Invierno"
elif [[ "$month" -eq 10 && "$day" -eq 31 ]]; then
  period="Halloween"
elif [[ "$month" -eq 11 && "$day" -eq 2 ]]; then
  period="Otoño"
elif [[ ( "$month" -eq 12 && "$day" -ge 21 ) || "$month" -eq 1 || "$month" -eq 2 || ( "$month" -eq 3 && "$day" -lt 20 ) ]]; then
  period="Invierno"
elif [[ ( "$month" -eq 3 && "$day" -ge 20 ) || "$month" -eq 4 || "$month" -eq 5 || ( "$month" -eq 6 && "$day" -lt 21 ) ]]; then
  period="Primavera"
elif [[ ( "$month" -eq 6 && "$day" -ge 21 ) || "$month" -eq 7 || "$month" -eq 8 || ( "$month" -eq 9 && "$day" -lt 23 ) ]]; then
  period="Verano"
elif [[ ( "$month" -eq 9 && "$day" -ge 23 ) || "$month" -eq 10 || "$month" -eq 11 || ( "$month" -eq 12 && "$day" -lt 21 ) ]]; then
  period="Otoño"
else
  echo "No se requiere actualización."
  exit 0
fi

# Actualizar la fecha en un archivo específico
echo "Última actualización: $(date) - Periodo: $period" > last_update.txt

# Configurar git
git config --global user.email "cozarkd@gmail.com"
git config --global user.name "Diego de Sousa"

# Hacer commit y push si el periodo ha cambiado
if [[ `git status --porcelain` ]]; then
  git add last_update.txt
  git commit -m "Actualización automática: $(date) - Periodo: $period"
  git push origin main
else
  echo "No hay cambios para hacer commit."
fi