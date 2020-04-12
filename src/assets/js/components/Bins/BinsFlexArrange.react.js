var React = require('react');
var Bin = require('./BinsFlex.react');
//var PutBackStore = require('../../stores/PutBackStore');

var Bins = React.createClass({

    getInitialState: function(){
        return this._sortBins(this.props.binsData.ppsbin_list,false);
    },
    componentWillReceiveProps: function() {
        this._sortBins(this.props.binsData.ppsbin_list,true);
    },

      _sortBins:function (aBins,shouldSetState){
         if (!aBins || (aBins.constructor !== Array && aBins.length < 1)){
            //no bins found
            return;
         }

        var totalBins = aBins.length;
        var totalWidth =0, totalHeight=0, lastHBin = {}, lastVBin={};


        lastHBin = aBins.reduce(function(oBinPrev,oBinCurr){
            if (oBinPrev.orig_coordinate[0] < oBinCurr.orig_coordinate[0]){
                return oBinCurr;
            }else if (oBinPrev.orig_coordinate[0] === oBinCurr.orig_coordinate[0]){
                return oBinCurr;
            }else{
                return oBinPrev;
            }
        });
        lastVBin = aBins.reduce(function(oBinPrev,oBinCurr){
            if (oBinPrev.orig_coordinate[1] < oBinCurr.orig_coordinate[1]){
                return oBinCurr;
            }else if (oBinPrev.orig_coordinate[1] === oBinCurr.orig_coordinate[1]){
                return oBinCurr;
            }else{
                return oBinPrev;
            }
        });
        if(shouldSetState){
            this.setState({
                aBins:aBins,
                lastHBin:lastHBin,
                lastVBin: lastVBin,
            });
        }
        else{
            return{
                 aBins:aBins,
                lastHBin:lastHBin,
                lastVBin: lastVBin
            }
        }
    },

    _createBinLayouts: function(aBins, lastHBin, lastVBin,  seatType, screenId, binCoordinatePlotting,dataToDisassociateTote) {
        if ((aBins.constructor !== Array && aBins.length < 1) || !(lastHBin.length) || !(lastVBin.length)){
            //no bins found
            return;
         }
         var aHTMLBins =[];
         // since the total width would be 100% but the bins would be divided into
         // ratios, hence each of the bin would have to have the factor into % of the
         // .bins container.
         // for reference orig_coordinate[0] === x axis and orig_coordinate[1] === y axis
         var horFactor = parseFloat(100/(Number(lastHBin.orig_coordinate[0]) + Number(lastHBin.length)));
         var vertFactor = parseFloat(100/(Number(lastVBin.orig_coordinate[1]) + Number(lastVBin.height)));

         var totalPpsWidth = Number(lastHBin.orig_coordinate[0]) + Number(lastHBin.length)


         for (var i =0; i<aBins.length ;i++){
                var binWidth = aBins[i].length * horFactor +'%';
                var binHeight = aBins[i].height * vertFactor +'%';
                var ileft=0;
                var itop=0;

                // if the seat type is front then we have to modify the x co-ordinate as per the formula:
                // the new x coordinate of a ppsbin is (Total length of pps - xcoordinate - length of bin)

                ileft = (seatType ==='back')? (aBins[i].orig_coordinate[0] * horFactor +'%'):
                    (totalPpsWidth - aBins[i].orig_coordinate[0] - aBins[i].length) * horFactor +'%';
                itop = aBins[i].orig_coordinate[1] * vertFactor+'%';

                if(binCoordinatePlotting == true || binCoordinatePlotting == "true"){
                  aHTMLBins.push(
                                   <div className="bin-container"
                                     style={{
                                        width: binWidth,
                                        height:binHeight,
                                        top: itop,
                                        left:ileft
                                      }}>
                                      <Bin dataToDisassociateTote={dataToDisassociateTote} binData={aBins[i]} screenId={screenId} binCoordinatePlotting={true}/>
                                   </div>
                                   )
                }
                else{
                  aHTMLBins.push(
                                   <div className="bin-container"
                                      style={{
                                        width: binWidth,
                                        height:binHeight,
                                        top: itop,
                                        left:ileft
                                      }}>
                                      <Bin dataToDisassociateTote={dataToDisassociateTote} binData={aBins[i]} screenId={screenId} />
                                   </div>
                                   )
                }
              }
        return aHTMLBins;
    },

    render: function() {
        
        var aHTMLBins = this._createBinLayouts(this.state.aBins,
                                               this.state.lastHBin,
                                               this.state.lastVBin,

                                               this.props.seatType,

                                               this.props.screenId,
                                               this.props.binCoordinatePlotting,this.props.dataToDisassociateTote);
        var self = this;
        return (
                 <div className="bins-flex" style={{width:document.body.clientWidth/1.7, height:document.body.clientHeight/2}}>
                        {aHTMLBins}
                 </div>
        );
    }
});

module.exports = Bins;
