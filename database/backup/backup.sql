PGDMP     7    	                 |            sw1_segundo_parcial    15.4    15.4 6    N           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            O           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            P           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            Q           1262    23355    sw1_segundo_parcial    DATABASE     �   CREATE DATABASE sw1_segundo_parcial WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Bolivia.1252';
 #   DROP DATABASE sw1_segundo_parcial;
                postgres    false            �            1259    23356    albums    TABLE       CREATE TABLE public.albums (
    uid uuid NOT NULL,
    nombre_album character varying(50) NOT NULL,
    descripcion character varying(200),
    evento_uid uuid,
    fotografo_uid uuid,
    fotografia_uid uuid,
    disponibilidad boolean,
    precio integer
);
    DROP TABLE public.albums;
       public         heap    postgres    false            �            1259    23359    eventos    TABLE     k  CREATE TABLE public.eventos (
    uid uuid NOT NULL,
    nombre_evento character varying(50) NOT NULL,
    descripcion character varying(200),
    fecha date NOT NULL,
    puntaje integer,
    lugar character varying(50) NOT NULL,
    ubicacion character varying(50) NOT NULL,
    esta_activo boolean,
    organizador_uid uuid,
    hora time without time zone
);
    DROP TABLE public.eventos;
       public         heap    postgres    false            �            1259    23362    fotografias    TABLE       CREATE TABLE public.fotografias (
    uid uuid NOT NULL,
    img_url character varying(2000),
    fecha_creacion date NOT NULL,
    visibilidad boolean NOT NULL,
    fotografo_uid uuid,
    metadatos_imgs_uid uuid,
    album_uid uuid,
    criterio_calidad character varying(50),
    precio integer,
    disponibilidad_album boolean,
    opcion_organizador_publica boolean,
    opcion_organizador_fotos_solo_por_evento boolean,
    opcion_organizador_solo_quienes_aparecen_evento boolean,
    esta_pagada boolean
);
    DROP TABLE public.fotografias;
       public         heap    postgres    false            �            1259    23367 
   fotografos    TABLE     S  CREATE TABLE public.fotografos (
    uid uuid NOT NULL,
    fullname character varying(50) NOT NULL,
    correo_electronico character varying(50) NOT NULL,
    password_user character varying(500) NOT NULL,
    rol_user character varying(50) NOT NULL,
    nro_telefono integer,
    tipo_fotografo character varying(50) NOT NULL,
    foto_perfil_url character varying(2000),
    direccion character varying(200),
    especialidad character varying(100),
    estado_suscripcion boolean NOT NULL,
    entidad character varying(100),
    permitido_en_evento boolean NOT NULL,
    evento_uid uuid
);
    DROP TABLE public.fotografos;
       public         heap    postgres    false            �            1259    23372    imagenes_entrenamientos    TABLE     �   CREATE TABLE public.imagenes_entrenamientos (
    uid uuid NOT NULL,
    img_url character varying(2000),
    invitado_uid uuid
);
 +   DROP TABLE public.imagenes_entrenamientos;
       public         heap    postgres    false            �            1259    23377    invitado_fotografias    TABLE       CREATE TABLE public.invitado_fotografias (
    invitado_uid uuid NOT NULL,
    fotografia_uid uuid NOT NULL,
    visible boolean NOT NULL,
    op_organizador_publica boolean,
    op_organizador_vean_invitado_evento boolean,
    op_organizador_vean_invitado_fotografia boolean
);
 (   DROP TABLE public.invitado_fotografias;
       public         heap    postgres    false            �            1259    23380 	   invitados    TABLE     �  CREATE TABLE public.invitados (
    uid uuid NOT NULL,
    fullname character varying(50) NOT NULL,
    correo_electronico character varying(50) NOT NULL,
    password_user character varying(500) NOT NULL,
    rol_user character varying(50) NOT NULL,
    nro_telefono integer,
    direccion character varying(500),
    foto_perfil_url character varying(2000),
    estado_suscripcion boolean NOT NULL,
    evento_uid uuid,
    luxand_uuid uuid,
    disponibilidad_evento boolean
);
    DROP TABLE public.invitados;
       public         heap    postgres    false            �            1259    23385    organizadors    TABLE     ~  CREATE TABLE public.organizadors (
    uid uuid NOT NULL,
    fullname character varying(50) NOT NULL,
    correo_electronico character varying(50) NOT NULL,
    password_user character varying(500) NOT NULL,
    rol_user character varying(50) NOT NULL,
    nro_telefono integer,
    foto_perfil_url character varying(2000),
    estado_suscripcion boolean,
    es_activo boolean
);
     DROP TABLE public.organizadors;
       public         heap    postgres    false            �            1259    23390    plan_suscripcions    TABLE     �   CREATE TABLE public.plan_suscripcions (
    uid uuid NOT NULL,
    nombre_plan character varying(50) NOT NULL,
    precio integer NOT NULL,
    periodicidad character varying(50) NOT NULL,
    descripcion character varying(200) NOT NULL
);
 %   DROP TABLE public.plan_suscripcions;
       public         heap    postgres    false            �            1259    23393    qrs    TABLE     �   CREATE TABLE public.qrs (
    uid uuid NOT NULL,
    habilitado boolean NOT NULL,
    tipo character varying(100),
    url_code character varying(2000),
    invitado_uid uuid,
    fotografo_uid uuid
);
    DROP TABLE public.qrs;
       public         heap    postgres    false            �            1259    23398    suscripcions    TABLE     �   CREATE TABLE public.suscripcions (
    uid uuid NOT NULL,
    estado boolean NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    fotografo_uid uuid,
    plan_suscripcion_uid uuid,
    invitado_uid uuid,
    organizador_uid uuid
);
     DROP TABLE public.suscripcions;
       public         heap    postgres    false            A          0    23356    albums 
   TABLE DATA           �   COPY public.albums (uid, nombre_album, descripcion, evento_uid, fotografo_uid, fotografia_uid, disponibilidad, precio) FROM stdin;
    public          postgres    false    214   �P       B          0    23359    eventos 
   TABLE DATA           �   COPY public.eventos (uid, nombre_evento, descripcion, fecha, puntaje, lugar, ubicacion, esta_activo, organizador_uid, hora) FROM stdin;
    public          postgres    false    215   �Q       C          0    23362    fotografias 
   TABLE DATA           2  COPY public.fotografias (uid, img_url, fecha_creacion, visibilidad, fotografo_uid, metadatos_imgs_uid, album_uid, criterio_calidad, precio, disponibilidad_album, opcion_organizador_publica, opcion_organizador_fotos_solo_por_evento, opcion_organizador_solo_quienes_aparecen_evento, esta_pagada) FROM stdin;
    public          postgres    false    216   �R       D          0    23367 
   fotografos 
   TABLE DATA           �   COPY public.fotografos (uid, fullname, correo_electronico, password_user, rol_user, nro_telefono, tipo_fotografo, foto_perfil_url, direccion, especialidad, estado_suscripcion, entidad, permitido_en_evento, evento_uid) FROM stdin;
    public          postgres    false    217   yW       E          0    23372    imagenes_entrenamientos 
   TABLE DATA           M   COPY public.imagenes_entrenamientos (uid, img_url, invitado_uid) FROM stdin;
    public          postgres    false    218   Y       F          0    23377    invitado_fotografias 
   TABLE DATA           �   COPY public.invitado_fotografias (invitado_uid, fotografia_uid, visible, op_organizador_publica, op_organizador_vean_invitado_evento, op_organizador_vean_invitado_fotografia) FROM stdin;
    public          postgres    false    219   ([       G          0    23380 	   invitados 
   TABLE DATA           �   COPY public.invitados (uid, fullname, correo_electronico, password_user, rol_user, nro_telefono, direccion, foto_perfil_url, estado_suscripcion, evento_uid, luxand_uuid, disponibilidad_evento) FROM stdin;
    public          postgres    false    220   �[       H          0    23385    organizadors 
   TABLE DATA           �   COPY public.organizadors (uid, fullname, correo_electronico, password_user, rol_user, nro_telefono, foto_perfil_url, estado_suscripcion, es_activo) FROM stdin;
    public          postgres    false    221   ]       I          0    23390    plan_suscripcions 
   TABLE DATA           `   COPY public.plan_suscripcions (uid, nombre_plan, precio, periodicidad, descripcion) FROM stdin;
    public          postgres    false    222   ^       J          0    23393    qrs 
   TABLE DATA           [   COPY public.qrs (uid, habilitado, tipo, url_code, invitado_uid, fotografo_uid) FROM stdin;
    public          postgres    false    223   n_       K          0    23398    suscripcions 
   TABLE DATA           �   COPY public.suscripcions (uid, estado, fecha_inicio, fecha_fin, fotografo_uid, plan_suscripcion_uid, invitado_uid, organizador_uid) FROM stdin;
    public          postgres    false    224   �_       �           2606    23402    albums albums_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_pkey PRIMARY KEY (uid);
 <   ALTER TABLE ONLY public.albums DROP CONSTRAINT albums_pkey;
       public            postgres    false    214            �           2606    23404    eventos eventos_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (uid);
 >   ALTER TABLE ONLY public.eventos DROP CONSTRAINT eventos_pkey;
       public            postgres    false    215            �           2606    23406    fotografias fotografias_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.fotografias
    ADD CONSTRAINT fotografias_pkey PRIMARY KEY (uid);
 F   ALTER TABLE ONLY public.fotografias DROP CONSTRAINT fotografias_pkey;
       public            postgres    false    216            �           2606    23408    fotografos fotografos_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.fotografos
    ADD CONSTRAINT fotografos_pkey PRIMARY KEY (uid);
 D   ALTER TABLE ONLY public.fotografos DROP CONSTRAINT fotografos_pkey;
       public            postgres    false    217            �           2606    23410 4   imagenes_entrenamientos imagenes_entrenamientos_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public.imagenes_entrenamientos
    ADD CONSTRAINT imagenes_entrenamientos_pkey PRIMARY KEY (uid);
 ^   ALTER TABLE ONLY public.imagenes_entrenamientos DROP CONSTRAINT imagenes_entrenamientos_pkey;
       public            postgres    false    218            �           2606    23412 .   invitado_fotografias invitado_fotografias_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.invitado_fotografias
    ADD CONSTRAINT invitado_fotografias_pkey PRIMARY KEY (invitado_uid, fotografia_uid);
 X   ALTER TABLE ONLY public.invitado_fotografias DROP CONSTRAINT invitado_fotografias_pkey;
       public            postgres    false    219    219            �           2606    23414    invitados invitados_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.invitados
    ADD CONSTRAINT invitados_pkey PRIMARY KEY (uid);
 B   ALTER TABLE ONLY public.invitados DROP CONSTRAINT invitados_pkey;
       public            postgres    false    220            �           2606    23416    organizadors organizadors_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.organizadors
    ADD CONSTRAINT organizadors_pkey PRIMARY KEY (uid);
 H   ALTER TABLE ONLY public.organizadors DROP CONSTRAINT organizadors_pkey;
       public            postgres    false    221            �           2606    23418 (   plan_suscripcions plan_suscripcions_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.plan_suscripcions
    ADD CONSTRAINT plan_suscripcions_pkey PRIMARY KEY (uid);
 R   ALTER TABLE ONLY public.plan_suscripcions DROP CONSTRAINT plan_suscripcions_pkey;
       public            postgres    false    222            �           2606    23420    qrs qrs_pkey 
   CONSTRAINT     K   ALTER TABLE ONLY public.qrs
    ADD CONSTRAINT qrs_pkey PRIMARY KEY (uid);
 6   ALTER TABLE ONLY public.qrs DROP CONSTRAINT qrs_pkey;
       public            postgres    false    223            �           2606    23422    suscripcions suscripcions_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.suscripcions
    ADD CONSTRAINT suscripcions_pkey PRIMARY KEY (uid);
 H   ALTER TABLE ONLY public.suscripcions DROP CONSTRAINT suscripcions_pkey;
       public            postgres    false    224            �           2606    23423    albums albums_evento_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_evento_uid_fkey FOREIGN KEY (evento_uid) REFERENCES public.eventos(uid);
 G   ALTER TABLE ONLY public.albums DROP CONSTRAINT albums_evento_uid_fkey;
       public          postgres    false    214    3215    215            �           2606    23428 !   albums albums_fotografia_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_fotografia_uid_fkey FOREIGN KEY (fotografia_uid) REFERENCES public.fotografias(uid);
 K   ALTER TABLE ONLY public.albums DROP CONSTRAINT albums_fotografia_uid_fkey;
       public          postgres    false    216    214    3217            �           2606    23433     albums albums_fotografo_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_fotografo_uid_fkey FOREIGN KEY (fotografo_uid) REFERENCES public.fotografos(uid);
 J   ALTER TABLE ONLY public.albums DROP CONSTRAINT albums_fotografo_uid_fkey;
       public          postgres    false    3219    214    217            �           2606    23438 $   eventos eventos_organizador_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_organizador_uid_fkey FOREIGN KEY (organizador_uid) REFERENCES public.organizadors(uid);
 N   ALTER TABLE ONLY public.eventos DROP CONSTRAINT eventos_organizador_uid_fkey;
       public          postgres    false    3227    215    221            �           2606    23443 &   fotografias fotografias_album_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fotografias
    ADD CONSTRAINT fotografias_album_uid_fkey FOREIGN KEY (album_uid) REFERENCES public.albums(uid);
 P   ALTER TABLE ONLY public.fotografias DROP CONSTRAINT fotografias_album_uid_fkey;
       public          postgres    false    3213    216    214            �           2606    23448 *   fotografias fotografias_fotografo_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fotografias
    ADD CONSTRAINT fotografias_fotografo_uid_fkey FOREIGN KEY (fotografo_uid) REFERENCES public.fotografos(uid);
 T   ALTER TABLE ONLY public.fotografias DROP CONSTRAINT fotografias_fotografo_uid_fkey;
       public          postgres    false    3219    216    217            �           2606    23453 %   fotografos fotografos_evento_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fotografos
    ADD CONSTRAINT fotografos_evento_uid_fkey FOREIGN KEY (evento_uid) REFERENCES public.eventos(uid);
 O   ALTER TABLE ONLY public.fotografos DROP CONSTRAINT fotografos_evento_uid_fkey;
       public          postgres    false    3215    217    215            �           2606    23458 A   imagenes_entrenamientos imagenes_entrenamientos_invitado_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.imagenes_entrenamientos
    ADD CONSTRAINT imagenes_entrenamientos_invitado_uid_fkey FOREIGN KEY (invitado_uid) REFERENCES public.invitados(uid);
 k   ALTER TABLE ONLY public.imagenes_entrenamientos DROP CONSTRAINT imagenes_entrenamientos_invitado_uid_fkey;
       public          postgres    false    220    3225    218            �           2606    23463 =   invitado_fotografias invitado_fotografias_fotografia_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invitado_fotografias
    ADD CONSTRAINT invitado_fotografias_fotografia_uid_fkey FOREIGN KEY (fotografia_uid) REFERENCES public.fotografias(uid);
 g   ALTER TABLE ONLY public.invitado_fotografias DROP CONSTRAINT invitado_fotografias_fotografia_uid_fkey;
       public          postgres    false    219    3217    216            �           2606    23468 ;   invitado_fotografias invitado_fotografias_invitado_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invitado_fotografias
    ADD CONSTRAINT invitado_fotografias_invitado_uid_fkey FOREIGN KEY (invitado_uid) REFERENCES public.invitados(uid);
 e   ALTER TABLE ONLY public.invitado_fotografias DROP CONSTRAINT invitado_fotografias_invitado_uid_fkey;
       public          postgres    false    220    219    3225            �           2606    23473 #   invitados invitados_evento_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invitados
    ADD CONSTRAINT invitados_evento_uid_fkey FOREIGN KEY (evento_uid) REFERENCES public.eventos(uid);
 M   ALTER TABLE ONLY public.invitados DROP CONSTRAINT invitados_evento_uid_fkey;
       public          postgres    false    3215    220    215            �           2606    23478    qrs qrs_fotografo_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.qrs
    ADD CONSTRAINT qrs_fotografo_uid_fkey FOREIGN KEY (fotografo_uid) REFERENCES public.fotografos(uid);
 D   ALTER TABLE ONLY public.qrs DROP CONSTRAINT qrs_fotografo_uid_fkey;
       public          postgres    false    217    223    3219            �           2606    23483    qrs qrs_invitado_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.qrs
    ADD CONSTRAINT qrs_invitado_uid_fkey FOREIGN KEY (invitado_uid) REFERENCES public.invitados(uid);
 C   ALTER TABLE ONLY public.qrs DROP CONSTRAINT qrs_invitado_uid_fkey;
       public          postgres    false    223    3225    220            �           2606    23488 ,   suscripcions suscripcions_fotografo_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.suscripcions
    ADD CONSTRAINT suscripcions_fotografo_uid_fkey FOREIGN KEY (fotografo_uid) REFERENCES public.fotografos(uid);
 V   ALTER TABLE ONLY public.suscripcions DROP CONSTRAINT suscripcions_fotografo_uid_fkey;
       public          postgres    false    224    3219    217            �           2606    23493 +   suscripcions suscripcions_invitado_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.suscripcions
    ADD CONSTRAINT suscripcions_invitado_uid_fkey FOREIGN KEY (invitado_uid) REFERENCES public.invitados(uid);
 U   ALTER TABLE ONLY public.suscripcions DROP CONSTRAINT suscripcions_invitado_uid_fkey;
       public          postgres    false    224    3225    220            �           2606    23498 .   suscripcions suscripcions_organizador_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.suscripcions
    ADD CONSTRAINT suscripcions_organizador_uid_fkey FOREIGN KEY (organizador_uid) REFERENCES public.organizadors(uid);
 X   ALTER TABLE ONLY public.suscripcions DROP CONSTRAINT suscripcions_organizador_uid_fkey;
       public          postgres    false    224    221    3227            �           2606    23503 3   suscripcions suscripcions_plan_suscripcion_uid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.suscripcions
    ADD CONSTRAINT suscripcions_plan_suscripcion_uid_fkey FOREIGN KEY (plan_suscripcion_uid) REFERENCES public.plan_suscripcions(uid);
 ]   ALTER TABLE ONLY public.suscripcions DROP CONSTRAINT suscripcions_plan_suscripcion_uid_fkey;
       public          postgres    false    3229    222    224            A   �   x����i1�]�4�`I�,�@*؋�l�����,	) 7��x|>yI*�S���@m8�0U��=<_������~�6s?�f�l�Ƽ������բ�ʀ�j�M��h��>��@���A�;�v^��,u����0	��p��-�,��:�YuAK��ܼfC�)�_��G��m�F��c���U�      B   !  x����j�0��~[��v+츍�`�^�؆�6IZ�~�Zz�i`|���O�9��yՆ� �W�lBU��F,_�:ԋ(�2��<����@����U,�8NG�*�"Q����y)��;3CT��H�OT]�&�dG�=s� S  �R�J���VՊݑ��Q�l���\�|'i�Hϧ��ϟ®,w-4dn0ls!���
�"C�!)�T����7zL������dAs�lT��F�~]�M�{��ȧ�\�e������W����"n��/sK�W�ݣR�t����~ �a~F      C   �  x�ŘI��HE��S��s0�}�
�I�,[�l���Do�6Z��i0�H����_�U-K������U�&��D��e�����y��شs�>pX��~Nq��1��w��y�,�q�V��c��Gju8�+6�ƶLO�8׮%4i�7�i���i�Qw�Ir�L��t�Ire�f`c`��/��a"*BIhO?�9�l<j��#�(�sXP>8�5���������T��O�(�-�Y�TY��Y��3�Re��Q�� v0���Ou�&|M����`H&�hQ3#�z�lHH��brH.E�#���桽Vk߹�:��iރ���7��BG�e�Sd%�,�F� ;ni�G�]���~]ӛ��d��s����iZ�.;�R*$j���-�|���^���:O�����`T��#�AS��3C�¤�<:-�{u �{��\D��^ֵ�}�^�{0�y�21H��6��6H���gA�`��K��`(��TkD�Xqh�s�~�����Y�)������6+� ��sT]�`�n��mr���2��g�m���܀S��C��%W��T�y�0x��aZ�k\˭�W�-��s�{0xS��!��eZ�LK�=KR%�T:���{�⎹�³�(�s-�ރ!X���@i��tNYqArz}G0�������^�m�a����K���J*jI"S��k.�*�{@�7����4�u�q��4<�|���������2��@j^��񎕤�	Jѭ(0��)��o�)ge����v��	C	6�Y�@.�Edh�bMtQ�r���=������נvx6��LK"�M�Bt*г�G,t0��8��*��ŁLa��;��Սk��Lf]�U��a�_��p��5u�� m��.���&4G0�=����yۢ�2Wf[������2fr�t�L�CJ�=Ŋ,M����w)�6�^�yT������py� �T�*�w�`��Eb�bƨD��S{��R���y[=�s�\��i�m���{�LL#	P�f.�-��`0{Kq�ǥ���Z���7��i}�}��o\�O�\���� 0A��&မ� {��[��1-��������o�S��)ZIE~ҁ!*>ƀ�F�������g=_��vm�'��1��K�?|||�>?o      D   }  x���Mo�@��ɯ��uB�+3s�(�/�ni�Of�IHT~�����J+Y�+۲���0(�"B,C�!4�PM�q�Jn�� �m���a�du�J\6�W^Yk���x}}���,^�����M�~�);�"����B�Tzy�>��xr;�����z��{�x;[������9�Xrƕ��i����(u�b�FF�/�ި�����2��y*�?*�h]����r"�j/�a����l���v(Lz=v�����	�R.�Q�S�JQ�N�����@䭲my1�B��:r8��VȊ�_`�ۗ�ל��!�Hf�{Ir<y�d��a���Ӵ�W5:t�߼��L� �'Z2Ĉ�Hkc��`�rG���[���o���0      E     x���Y�"!���.h�0g��r���Z,��C�*l}���'I	:Jv(4+��ޱh�!B&|��2�N���#^���>N�#݉�1_�D:5]�����!/n����iy��Z{��8a/��-N�O�Xôvv���1v��c;V_�,萬�ހ0Ik֣@�<+\�p`&�%i�Jk���
`��/��z�����iݪGݜ�]��ܾNO� D�+z�E9���X�Kw����z�5M�]���MS�_��dt酥����
	���rN-�7�3��n�^��;�[WݮK�ژ��:XX2�0�� �H:EJ19����:�y�csQݳI}�:R=	0?��:�E��7A뉌��D�;t�4n�tۓyj'�[�E��K2g-A�^7.�� W�,�GU?j�GbӪv~L}uY�?1�NWA�#����p��S~�±*D�>=�r���\����|���X��tWH����:7��*G,�H�T�{�������z�����s��t�v�A�{<� �� �      F   �   x���Kj1���]jp�cIw�F�����!�u�Z����8�B]
r�Q�K�o���z-b2���������Z;ߝ���ͥ�YL�F@V6$��2V>O�y��L��M���^U��*>mܡ9���!Ď4�g ֪����_��~ �{T�      G   %  x�u�Kk�@��ɯp�vd��̮(D�֖�ֶ��wf��#�����R�.�9p�8�KV#`�Hi��=�T�Z+@�h�uaS�}__(����7��eˮWQ�C��&?��A4�>�zϹYڇ�4�����wF�l�,G��7��Kޝ�ѵ7����j��Ba
E��Hd!A�-��ОK���Q?u�v�?��ǩ�ڸ���6�rDk׻��*�vuu���π�c:~��S�ퟰ!�H8jI$7Ht�xB\*r	u�\]V֎0�=�4a�r����R*�"���8� �4      H   �   x�u��n�0  g�X�b��H���Z�*�U�cʫH���2TM�J��t:�Jς�w($�b+���� �+�� J��B�~ԧ�%ؠx�����ֵ�%ʻ�67-ln33^�1�3�daP�$N�eT���,l��F��<5ٓJ��c��&8���h��^�DR踴�ĥ��R(���,E�S����>t3�ǬU�u}�{��<���u�j��i��2���I����Ⱦr������c������
h8      I   O  x�u�MN�0���)|�َ�:˲A,�*!�b���ʒ�ة�q8 �r1�����Ʋ��h�ۆ�LyN�㜈�uD�V�F��9'h�m#t�r�	1�~�m��9��>p	��M01��-`�q�J���2�uz|����;�_mr8��n�ڴ�/�]��y~��IRq/�`�&ByAA�����J/$3l����a��̻?����/���n�X ��vl?��E�t����8W	*-�Z��"TJC��%i8�D)nk�)8�,dw):$(Rs�?=����
�\6䪑`���%%�rb����5��Y*�ZC<�q��ߖ��H�O��C�|SU���@      J   a   x����0 �o��J����#����{�Z��UBRv,�%��J546	q��F�ۏ��=�����igd)����8:w���b�.iRJ?#�w      K   i  x��VA�9\�wF`c��dc0� �Whi�Q�FJ�7-��]��
�舂<�V�>Н�fQ����5pL ��ϒ�Y~��k��ǯK20�3�����EN_�.�V��ל�Kb��`ۦ�`�*|����(
 cDōE�K2��k3�D�^٤sk��=������L��Q�0'%p�42�Y#\���Ȝ-��]�[xw�s:35���R�V�ã��!�d�Nb���uӄ<^#sSc��׽�s�r1,���NJ�kd�Β�\:q0'��TX{�y��V�wގn�`U�׆��\D�;�[d�R������H�ݴg�v������kY���3H
J�U��~<漯��,g疋��#��Gk�.zO�}pō�=4�)����|:���n��ʴ��,r�N��K��3��ut���tF�[�ѵ&�9��0�`�;c���կ'�>��l���.��Q�_[�O�Mfq����LVw�.���T蒉>I���<��n!K�㈝�c�QZ��&*��Y�K�6t"�n�҇3�֌��i�����D��0���+���	��Wv�[��<3�%3��pu���$Z3��3�C���@u�ϓ��J�H�`uf�����K���Dj�F��_����Ǣ�     