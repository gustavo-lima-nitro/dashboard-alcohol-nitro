<#
  Nitro · Alcohol Intelligence — servidor estático local (zero dependência)

  Por que existe: uma página aberta em file:// não consegue ler o .env (o navegador
  bloqueia fetch para arquivos locais). Este script serve a raiz do projeto por HTTP
  usando apenas o HttpListener do .NET, já presente em qualquer Windows.

  Uso:
      powershell -ExecutionPolicy Bypass -File serve.ps1

  O .env é lido pelo navegador — ou seja, as chaves chegam ao front-end. Isso é
  aceitável para uso local em máquina do próprio analista. Se quiser manter as
  chaves fora do navegador, use o server.mjs (proxy) em vez deste script.
#>

[CmdletBinding()]
param(
  [int]$Port = 0,
  [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

# ── porta: parâmetro > PORT do .env > 8080 ────────────────────────────────────
if ($Port -eq 0) {
  $envFile = Join-Path $root '.env'
  if (Test-Path $envFile) {
    $line = Select-String -Path $envFile -Pattern '^\s*PORT\s*=\s*(\d+)' | Select-Object -First 1
    if ($line) { $Port = [int]$line.Matches[0].Groups[1].Value }
  }
  if ($Port -eq 0) { $Port = 8080 }
}

$MIME = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.js'='text/javascript; charset=utf-8'; '.mjs'='text/javascript; charset=utf-8'
  '.json'='application/json; charset=utf-8'; '.csv'='text/csv; charset=utf-8'
  '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.gif'='image/gif'; '.ico'='image/x-icon'; '.woff'='font/woff'; '.woff2'='font/woff2'
  '.pdf'='application/pdf'; '.md'='text/markdown; charset=utf-8'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
try {
  $listener.Start()
} catch {
  Write-Host "Nao foi possivel abrir a porta $Port. Tente: -Port 8090" -ForegroundColor Red
  throw
}

$url = "http://localhost:$Port/Dashboards/index.html"
Write-Host ""
Write-Host "  Nitro · Alcohol Intelligence" -ForegroundColor Green
Write-Host "  servindo $root"
Write-Host "  $url" -ForegroundColor Yellow
Write-Host "  Ctrl+C para parar."
Write-Host ""
if (-not $NoBrowser) { Start-Process $url | Out-Null }

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    try {
      # o front consulta /api/config para saber se ha um proxy; aqui nao ha.
      if ($req.Url.AbsolutePath -eq '/api/config') {
        $res.StatusCode = 404
        $res.Close()
        continue
      }

      $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
      if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'Dashboards/index.html' }
      $path = Join-Path $root ($rel -replace '/', '\')

      # nao deixa escapar da raiz do projeto
      $full = [System.IO.Path]::GetFullPath($path)
      if (-not $full.StartsWith([System.IO.Path]::GetFullPath($root), [StringComparison]::OrdinalIgnoreCase)) {
        $res.StatusCode = 403; $res.Close(); continue
      }

      if (Test-Path $full -PathType Container) { $full = Join-Path $full 'index.html' }

      if (-not (Test-Path $full -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("404 - $rel")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close(); continue
      }

      $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
      $ct = $MIME[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      # o .env nao tem extensao conhecida — serve como texto
      if ([System.IO.Path]::GetFileName($full) -eq '.env') { $ct = 'text/plain; charset=utf-8' }

      $bytes = [System.IO.File]::ReadAllBytes($full)
      $res.ContentType = $ct
      $res.Headers.Add('Cache-Control', 'no-store')
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
      Write-Host ("  {0}  {1}" -f $res.StatusCode, $rel) -ForegroundColor DarkGray
    } catch {
      try { $res.StatusCode = 500; $res.Close() } catch {}
    }
  }
} finally {
  $listener.Stop(); $listener.Close()
}
