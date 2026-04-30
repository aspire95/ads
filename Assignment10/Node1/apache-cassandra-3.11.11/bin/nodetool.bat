@echo off
if "%OS%" == "Windows_NT" setlocal

pushd "%~dp0"
call cassandra.in.bat

@REM --- RAREN'S PERMANENT FIXES ---
set "JAVA_HOME=C:\Program Files\Java\jre1.8.0_481"
set "JAVA_OPTS=%JAVA_OPTS% -Djava.net.preferIPv4Stack=true"
@REM -------------------------------

if NOT DEFINED CASSANDRA_HOME set CASSANDRA_HOME=%~dp0..

set CASSANDRA_PARAMS=%CASSANDRA_PARAMS% -Dcassandra.logdir="%CASSANDRA_HOME%\logs"
set CASSANDRA_PARAMS=%CASSANDRA_PARAMS% -Dcassandra.storagedir="%CASSANDRA_HOME%\data"

@REM We added the IPv4 flag directly into the execution line below
"%JAVA_HOME%\bin\java" -Djava.net.preferIPv4Stack=true -cp %CASSANDRA_CLASSPATH% %CASSANDRA_PARAMS% -Dlogback.configurationFile=logback-tools.xml org.apache.cassandra.tools.NodeTool %*
goto finally

:err
echo The JAVA_HOME environment variable must be set to run this program!
pause

:finally
ENDLOCAL & set RC=%ERRORLEVEL%
exit /B %RC%