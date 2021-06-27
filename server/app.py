
from flask import Flask, request, session, redirect, url_for, render_template, make_response, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
app = Flask(__name__)
import os
import subprocess

# config the folder that flask can run the htmls
template_folder = './templates'
CORS(app=app)




@app.route('/')
def index():
    # run  the app.html into window
    return render_template('index.html')
    # return redirect(url_for('admin.index'))


@app.route('/deal',methods=['GET','POST'])
def deal():
    if request.method =='POST':
        print('===POST===')
        c_file = request.get_json().get('solFile')
        c_name = request.get_json().get('c_name')
        file_path = './TT/user_write_sol_file.sol'
        with open(file_path,'w')as f:
            f.write(c_file)

        res_boogie = []
        res_corral = []
        sol2boogie = []
        source_file = []

        (res_boogie,res_corral,sol2boogie,source_file,command_output) = fun2verisol('user_write_sol_file.sol',c_name)


        return {"status":"custom success!!!",
                "source_file":source_file,
                "cmd_output":command_output,
                "res_boogie":res_boogie,
                "res_corral":res_corral,
                "sol2boogie":sol2boogie
        }

    else:
        return 'GET'

@app.route('/upload',methods=['POST'])          
def upload():
    print('======upload===')
    contract_name = request.values.to_dict().get('name')
    f = request.files['file']
    f.save(os.path.join('TT/',secure_filename(f.filename)))
    res_boogie = []
    res_corral = []
    sol2boogie = []
    source_file = []
    print('===filename===',f.filename)
    print('===contract_name===',contract_name)
    (res_boogie,res_corral,sol2boogie,source_file,command_output) = fun2verisol(f.filename,contract_name)

    return {"status":"upload success!!!",
            "source_file":source_file,
            "cmd_output":command_output,
            "res_boogie":res_boogie,
            "res_corral":res_corral,
            "sol2boogie":sol2boogie
    }

def fun2verisol(filename,contract_name):

    # process = subprocess.Popen("cd TT && VeriSol "+filename+" "+contract_name, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    cmd = "cd TT && VeriSol "+filename+" "+contract_name
    print('===cmd is ===',cmd)
    process = subprocess.Popen(cmd,shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

    command_output = process.stdout.read().decode('utf-8')

    res_boogie = []
    res_corral = []
    sol2boogie = []
    source_file = []

    file_path = './TT/'+filename

    if(os.path.exists(file_path)):
        with open(file_path,'r')as f:
            source_file = f.read()

    if(os.path.exists('./TT/boogie.txt')):
        with open('./TT/boogie.txt','r')as f:
            res_boogie = f.read()
        os.remove('./TT/boogie.txt')

    if(os.path.exists('./TT/corral.txt')):
        with open('./TT/corral.txt','r')as f:
            res_corral = f.read()
        os.remove('./TT/corral.txt')
        if(~os.path.exists('./TT/corral.txt')):
            print('===remove corral success!!===')


    if(os.path.exists('./TT/__SolToBoogieTest_out.bpl')):
        with open('./TT/__SolToBoogieTest_out.bpl','r')as f:
            sol2boogie = f.read()
        os.remove('./TT/__SolToBoogieTest_out.bpl')
        if(~os.path.exists('./TT/__SolToBoogieTest_out.bpl')):
            print('===remove __SolToBoogieTest_out success!!===')


    return (res_boogie,res_corral,sol2boogie,source_file,command_output)


if __name__ == '__main__':
    # app.run(host, port, debug, options)
   app.run(debug = True)