#!/bin/bash

RELVSNCMD="git describe  --abbrev=7 --tags --always --first-parent"

case "$1" in
    run)
	RELVSN=$(exec ${RELVSNCMD})
	mkdir extraction_ui-$RELVSN
	install -d extraction_ui-$RELVSN/opt/extraction_ui
	cp index.html extraction_ui-$RELVSN/opt/extraction_ui
	cp -r assets extraction_ui-$RELVSN/opt/extraction_ui
	install -d extraction_ui-$RELVSN/var/log/extraction_ui
	install -d extraction_ui-$RELVSN/usr/local/bin/
	install -d extraction_ui-$RELVSN/etc/extraction_ui
	install -d extraction_ui-$RELVSN/etc/init.d
	cp -r ../dpkg_conf/extraction_ui extraction_ui-$RELVSN/etc/init.d/extraction_ui
	mkdir extraction_ui-$RELVSN/DEBIAN
	cp ../dpkg_conf/extraction_ui/control extraction_ui-$RELVSN/DEBIAN/control
	cp ../dpkg_conf/extraction_ui/rules extraction_ui-$RELVSN/DEBIAN/rules
	cp ../dpkg_conf/extraction_ui/copyright extraction_ui-$RELVSN/DEBIAN/copyright
	cp ../dpkg_conf/extraction_ui/changelog extraction_ui-$RELVSN/DEBIAN/changelog
	ln -sf /opt/extraction_ui/bin/extraction_ui extraction_ui-$RELVSN/usr/local/bin/
	ln -sf /opt/extraction_ui/log extraction_ui-$RELVSN/var/log/extraction_ui
	chmod u+rw ./extraction_ui-$RELVSN
	sed -i --follow-symlinks "s/Version:.*$/Version: $RELVSN/" extraction_ui-$RELVSN/DEBIAN/control
	fakeroot dpkg-deb --build extraction_ui-$RELVSN
	rm -rf ./extraction_ui-$RELVSN
	;;
    *)
        echo "Usage: $SCRIPT {run}"
        exit 1
        ;;
esac

exit 0