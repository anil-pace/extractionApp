var React = require('react');
var Bin = require('./Bin.react');
//var PutBackStore = require('../../stores/PutBackStore');

var Bins = React.createClass({
    componentDidMount: function() {
        if(this.props.binsData["structure"]){
            this._calculateAndSetBinDimensions(this.props.binsData["structure"]);
        }
        
    },
    _findCoordinatesIndex:function(x,y){
        var i = 0;
        this.props.binsData.ppsbin_list.map(function(value,index){
            if(value.coordinate[0]==x && value.coordinate[1]==y){
                i=index;
                return ;
            }
        });
        return i;
    },
    render: function() {
        if(this.props.binsData["structure"]){
        this._calculateAndSetBinDimensions(this.props.binsData["structure"]);
    }
        var compData = this.props.binsData;
        var dataToDisassociateTote=this.props.dataToDisassociateTote
        var scrnId = this.props.screenId;
        var self = this;
        return (
                 <div className="bins">
                    {
                        (function(){
                            var l =[]; 
                            for(var j = 0 ;j<compData.structure[0] ;j++){
                            var list = [];
                            var i = 0;
                            for( i = i ; i<compData.structure[1] ; i++){
                                list.push(<Bin dataToDisassociateTote={dataToDisassociateTote} binData={compData.ppsbin_list[self._findCoordinatesIndex(j+1,i+1)]} screenId={scrnId} />);
                            }
                            l.push((
                                <div className="bin-row">
                                    {list}
                                </div>
                                ));
                        }
                        return l;
                        })()
                    }
                 </div>
        );
    },

    _calculateAndSetBinDimensions: function(dimension){
        var myElements = document.querySelectorAll(".bin");
        for (var i = 0; i < myElements.length; i++) {
            myElements[i].style.height = 0 + "px";
            myElements[i].style.width = 0 + "px";
        }
        var clientHeight = $('.bins').height();
        var clientWidth = $('.bins').width();
        var boxSize = Math.min(clientHeight/dimension[0],clientWidth/dimension[1]);
        for (var i = 0; i < myElements.length; i++) {
            myElements[i].style.height = boxSize + "px";
            myElements[i].style.width = boxSize + "px";
        }
    }
});

module.exports = Bins;