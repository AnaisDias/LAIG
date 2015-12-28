:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_path)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server_files)).

:- use_module(library(lists)).
:- use_module(library(random)).

:- http_handler(root(game), prepReplyStringToJSON, []).						% Predicate to handle requests on server/game (for Prolog Game Logic)
:- http_handler(pub(.), serve_files_in_directory(pub), [prefix]).			% Serve files in /pub as requested (for WebGL Game Interface)
http:location(pub, root(pub), []).											% Location of /pub alias on server
user:file_search_path(document_root, '.').									% Absolute location of HTTP server document root
user:file_search_path(pub, document_root(pub)).								% location of /pub in relation to document root

server(Port) :- http_server(http_dispatch, [port(Port)]).		% Start server on port Port

%Receive Request as String via POST
prepReplyStringToJSON(Request) :- 
		member(method(post), Request), !,						% if POST
        http_read_data(Request, Data, []),						% Retrieve POST Data
		processString(Data, Reply),								% Call processing predicate
		format('Content-type: application/json~n~n'),			% Reply will be JSON
		formatAsJSON(Reply).									% Send Reply as JSON

prepReplyStringToJSON(_Request) :-								% Fallback for non-POST Requests
		format('Content-type: text/plain~n~n'),					% Start preparing reply - reply type
		write('Can only handle POST Requests'),					% Standard Reply
		format('~n').											% End Reply

formatAsJSON(Reply):-
		write('{'),												% Start JSON Object
		Fields = [newPlayer, newPlay, newBoard, message, nx, ny],				% Response Field Names
		writeJSON(Fields, Reply).								% Format content as JSON 
		
writeJSON([Prop], [Val]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('"}').						% Last element
writeJSON([Prop|PT], [Val|VT]):-
	write('"'), write(Prop),
	write('":"'), write(Val), write('", '),						% Separator for next element
	writeJSON(PT, VT).

processString([_Par=Val], R):-
        term_string(List, Val),									% Convert Parameter String to Prolog List
		R = [_NP1, _NP2, _NB, _M, _NX, _NY],										% Variables for Response
		append(List, R, ListR),									% Add extra Vars to Request
		Term =.. ListR,											% Create Term from ListR
		Term.													% Call the Term

%---------------------------------------------
%
% New play is 1 for neutron, 2 for jogada, 3 for end (when end NewPlayer is the player that won)
% New player is 1 or 2
% New board returns -1 on error
%

jogada(Board, NXi, NYi, Xi, Yi, Xf, Yf, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-		
	
	valida_jogada(Board,Xi, Yi, Xf, Yf, Player),
	atualiza_jogada(Board,Xi, Yi, Xf, Yf, NewBoard),
	
	(
		verifica_fim(NXi, NYi, NewBoard, Player, NewPlayer),
		
		NewPlay is 3,
		Message = "The End"
		;
		(
			Player == 1,
			NewPlayer is 2;
			Player == 2,
			NewPlayer is 1
		),
		NX is -1, NY is -1,
		NewPlay is 1,
		Message = "Move Valid"
	);
	NewPlay is 2,
	(
		Player == 1,
		NewPlayer is 1;
		Player == 2,
		NewPlayer is 2
	),
	NX is -1, NY is -1,
	NewBoard is -1,
	Message = "Move Invalid".							

jogada_neutrao(Board, NXi, NYi, NXf, NYf, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-

	valida_jogada(Board, NXi, NYi, NXf, NYf,3),
	atualiza_jogada(Board,NXi, NYi, NXf, NYf, NewBoard),
	NX is NXf, NY is NYf,
	
	(
		verifica_fim(NXf , NYf , NewBoard, Player, NewPlayer),
		NewPlay is 3,
		Message = "The End"
		;
    ( 
      Player == 1,
      NewPlayer is 1;
      Player == 2,
      NewPlayer is 2
    ),
		NewPlay is 2,
		Message = "Move Valid"
	);
	NewPlay is 1,
	(
		Player == 1,
		NewPlayer is 1;
		Player == 2,
		NewPlayer is 2
	),
	NX is -1, NY is -1,
	NewBoard is -1,
	Message = "Move Invalid".	

jog_poss(Board, Xi, Yi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-
	jogadas_possiveis(Board, Xi, Yi, 0, Player, NewBoard),
	Message = "Success!".

jogada_ale(Board, NXr, NYr, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-
	jogada_aleatoria(Board, Xi, Yi, Xf, Yf, Player),
	atualiza_jogada(Board, Xi, Yi, Xf, Yf, NewBoard),
	NX is -1, NY is -1,
	(
		verifica_fim(NXr, NYr, NewBoard, Player, NewPlayer),
		
		NewPlay is 3,
		Message = "The End"
		;
		(
			Player == 1,
			NewPlayer is 2;
			Player == 2,
			NewPlayer is 1
		),
		NewPlay is 1,
		Message = "Made a Random Move"
	).

jogada_ale_neutron(Board, Xi, Yi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-
	jogada_aleatoria(Board, Xi, Yi, Xf, Yf, 3),
	atualiza_jogada(Board, Xi, Yi, Xf, Yf, NewBoard),
	NX is Xf,
	NY is Yf,
	(
		verifica_fim(Xf , Yf , NewBoard, Player, NewPlayer),
		NewPlay is 3,
		Message = "The End"
		;	
    (
    Player == 1,
    NewPlayer is 1;
    Player == 2,
    NewPlayer is 2
    ),
		NewPlay is 2,
		Message = "Made a Random Neutron Move"
	).

jogada_int(Board, NXi, NYi, Player, NewPlayer, NewPlay, NewBoard, Message, NX, NY):-
	jogada_inteligente_neutron(Board,NXi, NYi, NXf, NYf, Player),
	atualiza_jogada(Board, NXi, NYi, NXf, NYf, NewBoard),
	NX is NXf,
	NY is NYf,
	
	(
		verifica_fim(NXf , NYf , NewBoard, Player, NewPlayer),
		NewPlay is 3,
		Message = "The End"
		;	
    (
      Player == 1,
      NewPlayer is 1;
      Player == 2,
      NewPlayer is 2
    ),
		NewPlay is 2,
		Message = "Made an Inteligent Neutron Move"
	).
	

valida_jogada(Tab, Xi, Yi, Xf, Yf, N):-
        (Xi =\= Xf;
        Yi =\= Yf),
        
        busca_elemento(Tab, Xi, Yi, N),
        (
           Xf = Xi,
           (
              Yf > Yi,
              M is 2;
              M is 6
           )
        ;
           Yf = Yi,
           (
              Xf > Xi,
              M is 4;
              M is 0
           )
        ;
           DX is Xf - Xi, 
           DY is Yf - Yi,
           Adx is abs(DX),
           Ady is abs(DY),
           Adx = Ady,
           (
              DX < 0, DY > 0,
              M is 1;
              DX > 0, DY > 0,
              M is 3;
              DX > 0, DY < 0,
              M is 5;
              DX < 0, DY < 0,
              M is 7
           )
        ),
        verifica_maximo(Tab, Xi, Yi, Xm, Ym, M,N),
        !,
        %write('\nValores '),write(Xm),nl,write(Ym),nl,nl,
        Xm = Xf,
        Ym = Yf.

verifica_maximo(Tab, Xi, Yi, Xm, Ym, M, N):-
       busca_elemento(Tab, Xi, Yi, N),
       (
          M = 0,
          X1 is Xi - 1,
          Y1 is Yi;
          M = 1,
          X1 is Xi - 1,
          Y1 is Yi + 1;         
          M = 2,
          X1 is Xi,
          Y1 is Yi + 1;         
          M = 3,
          X1 is Xi + 1,
          Y1 is Yi + 1;         
          M = 4,
          X1 is Xi + 1,
          Y1 is Yi;         
          M = 5,
          X1 is Xi + 1,
          Y1 is Yi - 1;         
          M = 6,
          X1 is Xi,
          Y1 is Yi - 1;         
          M = 7,
          X1 is Xi - 1,
          Y1 is Yi - 1
       ),
       (
          verifica_maximo(Tab, X1, Y1, Xm, Ym, M, 0);
          Xm is Xi,
          Ym is Yi
       ).

busca_elemento([Tab|_], 0, Yi, E):-
	    busca_linha(Tab, Yi, E).

busca_elemento([_|Tab], Xi, Yi, E):-
        X is Xi - 1,
        busca_elemento(Tab, X, Yi, E).

busca_linha([Tab|_], 0, Tab).

busca_linha([_|Tab], Yi, E):-
        Y is Yi - 1,
        busca_linha(Tab, Y, E).


atualiza_jogada(Tab, Xi, Yi, Xf, Yf, Tab_f2):-
        busca_elemento(Tab, Xi, Yi, E),
        muda_elemento(Tab, Xf, Yf, E, Tab_f),
        muda_elemento(Tab_f, Xi, Yi, 0, Tab_f2).


muda_elemento([Tab|Tail], 0, Yf, E, [Tab_f|Tail]):-
        muda_linha(Tab, Yf, E, Tab_f).

muda_elemento([Tab|Tail], Xf, Yf, E, [Tab|Tab_f]):-
        X is Xf - 1,
        muda_elemento(Tail, X, Yf, E, Tab_f).

muda_linha([_|Tail], 0, E, [E|Tail]).

muda_linha([Tab|Tail], Yf, E, [Tab|Tail_f]):-
        Y is Yf - 1,
        muda_linha(Tail, Y, E, Tail_f).

verifica_fim(Nx,Ny,Tab,J,NJ):-
        Nx == 0,
        NJ is 1;
        J == 2,
        verifica_encurralado(Tab, Nx, Ny),
        NJ is 1
        ; 
        Nx == 4,
        NJ is 2;
        J == 1,
        verifica_encurralado(Tab, Nx, Ny),
        NJ is 2.

verifica_encurralado(Tab, NX, NY):-
        verifica_maximo(Tab, NX, NY, X0, Y0, 0, 3),
        !,
        NX == X0,
        NY == Y0,
        verifica_maximo(Tab, NX, NY, X1, Y1, 1, 3),
        !,
        NX == X1,
        NY == Y1,
        verifica_maximo(Tab, NX, NY, X2, Y2, 2, 3),
        !,
        NX == X2,
        NY == Y2,
        verifica_maximo(Tab, NX, NY, X3, Y3, 3, 3),
        !,
        NX == X3,
        NY == Y3,
        verifica_maximo(Tab, NX, NY, X4, Y4, 4, 3),
        !,
        NX == X4,
        NY == Y4,
        verifica_maximo(Tab, NX, NY, X5, Y5, 5, 3),
        !,
        NX == X5,
        NY == Y5,
        verifica_maximo(Tab, NX, NY ,X6, Y6, 6, 3),
        !,
        NX == X6,
        NY == Y6,
        verifica_maximo(Tab, NX, NY, X7, Y7, 7, 3),
        !,
        NX == X7,
        NY == Y7.

jogadas_possiveis(_,_,_,8,_,[]).
jogadas_possiveis(Tab, Xi, Yi, M,N, [[Xm,Ym]|T]):-
        verifica_maximo(Tab, Xi, Yi, Xm, Ym, M, N),
        valida_jogada(Tab, Xi, Yi, Xm, Ym, N),
        M1 is M +1,
        jogadas_possiveis(Tab, Xi, Yi, M1,N, T).
jogadas_possiveis(Tab, Xi, Yi, M,N, T):-
        M1 is M +1,
        jogadas_possiveis(Tab, Xi, Yi, M1,N, T).



encontra_peca(Tab, P, X, Y):-
       (
          random(0, 5, X),
          random(0, 5, Y),
          busca_elemento(Tab, X, Y, P)
       ;
          encontra_peca(Tab, P, X, Y)
        ).

jogada_aleatoria(Tab, Xi, Yi, Xf, Yf, P):-
        (
           (
              P = 3
           ;
              encontra_peca(Tab, P, Xi, Yi)
           ),
           random(0, 8, M),
           verifica_maximo(Tab, Xi, Yi, Xf, Yf, M, P),
           valida_jogada(Tab, Xi, Yi, Xf, Yf, P)
        ;
           jogada_aleatoria(Tab, Xi, Yi, Xf, Yf, P) 
         ).

melhor_jogada([],_,_,_):-
        !,false.
melhor_jogada([[X,Y]|_],X,X,Y).
melhor_jogada([_|T],X,Xf,Yf):-
        melhor_jogada(T,X,Xf,Yf).
        
elimina_jogadas([],_,[]).
elimina_jogadas([[X,_]|T],X,TR):-
        elimina_jogadas(T,X,TR).
elimina_jogadas([[X,Y]|T],X1,[[X,Y]|TR]):-
        elimina_jogadas(T,X1,TR).



jogada_inteligente_neutron(Tab, Xi, Yi, Xf, Yf, J):-
        jogadas_possiveis(Tab, Xi, Yi, 0, 3, R),
        (
           (
              J = 1,
              melhor_jogada(R, 0, Xf, Yf)
           ;
              melhor_jogada(R, 4, Xf, Yf)
           )
        ;
           (
              J = 1,
              elimina_jogadas(R, 4, RR)
           ;
              elimina_jogadas(R, 0, RR)
           ),
        random_select([Xf,Yf], RR, _)
        ;
        jogada_aleatoria(Tab, Xi, Yi, Xf, Yf, 3)
        ).

:- server(8081).